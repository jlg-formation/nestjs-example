import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { App } from 'supertest/types';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ApiExceptionFilter } from '../src/common/filters/api-exception.filter';
import { ClientRepository, DB_CLIENT } from '../src/soldes/client.repository';
import { TestTxDbClient } from './utils/test-tx-db-client';

describe('POST /recharge (e2e)', () => {
  let app: INestApplication<App>;
  let clientRepo: ClientRepository;
  let db: TestTxDbClient;
  let apiKey: string;

  beforeAll(async () => {
    process.env.API_KEY = process.env.API_KEY ?? 'test-api-key';
    apiKey = process.env.API_KEY;

    db = new TestTxDbClient();
    await db.connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DB_CLIENT)
      .useValue(db)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new ApiExceptionFilter());

    await app.init();

    clientRepo = app.get(ClientRepository);
  });

  beforeEach(async () => {
    await db.beginTestTransaction();
  });

  afterEach(async () => {
    await db.rollbackTestTransaction();
  });

  afterAll(async () => {
    await app.close();
    await db.close();
  });

  it('should recharge and return { data } with an increased balance', async () => {
    const clientId = randomUUID();
    const amount = 10;

    await clientRepo.insert({ id: clientId, name: 'E2E Bob' });

    const initialBalance = await request(app.getHttpServer())
      .get(`/clients/${clientId}/soldes`)
      .set('x-api-key', apiKey)
      .expect(200)
      .then((res) => {
        const body = res.body as { data?: { balance?: number } };
        return body.data?.balance;
      });

    if (typeof initialBalance !== 'number') {
      throw new Error('Expected initial balance to be a number');
    }

    await request(app.getHttpServer())
      .post('/recharge')
      .set('x-api-key', apiKey)
      .send({ clientId, amount })
      .expect(201)
      .expect(({ body }) => {
        const responseBody = body as {
          data?: {
            id?: string;
            balance?: number;
          };
        };

        expect(responseBody.data).toBeDefined();
        expect(responseBody.data?.id).toBe(clientId);
        expect(responseBody.data?.balance).toBe(initialBalance + amount);
      });
  });

  it('should expose the current balance on GET /clients/:id/soldes', async () => {
    const clientId = randomUUID();
    const amount = 15;

    await clientRepo.insert({ id: clientId, name: 'E2E Alice' });

    await request(app.getHttpServer())
      .post('/recharge')
      .set('x-api-key', apiKey)
      .send({ clientId, amount })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/clients/${clientId}/soldes`)
      .set('x-api-key', apiKey)
      .expect(200)
      .expect(({ body }) => {
        const responseBody = body as {
          data?: {
            clientId?: string;
            balance?: number;
          };
        };

        expect(responseBody.data).toBeDefined();
        expect(responseBody.data?.clientId).toBe(clientId);
        expect(responseBody.data?.balance).toBe(amount);
      });
  });

  it('should return 404 when client is unknown', async () => {
    const unknownClientId = randomUUID();

    await request(app.getHttpServer())
      .get(`/clients/${unknownClientId}/soldes`)
      .set('x-api-key', apiKey)
      .expect(404)
      .expect(({ body }) => {
        const responseBody = body as { statusCode?: number; message?: string };
        expect(responseBody.statusCode).toBe(404);
        expect(responseBody.message).toContain('Client');
      });
  });
});
