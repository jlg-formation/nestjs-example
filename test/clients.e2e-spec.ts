import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { App } from 'supertest/types';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ApiExceptionFilter } from '../src/common/filters/api-exception.filter';
import { ClientRepository, DB_CLIENT } from '../src/soldes/client.repository';
import { TestTxDbClient } from './utils/test-tx-db-client';

describe('GET /clients (e2e)', () => {
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

  it('should list clients and return { data }', async () => {
    const clientId1 = randomUUID();
    const clientId2 = randomUUID();

    await clientRepo.insert({ id: clientId1, name: 'E2E Clients Alice' });
    await clientRepo.insert({ id: clientId2, name: 'E2E Clients Bob' });

    await request(app.getHttpServer())
      .get('/clients?limit=100&offset=0')
      .set('x-api-key', apiKey)
      .expect(200)
      .expect(({ body }) => {
        const responseBody = body as {
          data?: Array<{ id?: string; name?: string; balance?: number }>;
        };

        expect(Array.isArray(responseBody.data)).toBe(true);

        const ids = (responseBody.data ?? []).map((c) => c.id);
        expect(ids).toEqual(expect.arrayContaining([clientId1, clientId2]));

        const alice = (responseBody.data ?? []).find((c) => c.id === clientId1);
        const bob = (responseBody.data ?? []).find((c) => c.id === clientId2);

        expect(alice).toBeDefined();
        expect(alice?.name).toBe('E2E Clients Alice');
        expect(alice?.balance).toBe(0);

        expect(bob).toBeDefined();
        expect(bob?.name).toBe('E2E Clients Bob');
        expect(bob?.balance).toBe(0);
      });
  });

  it('should return 400 when limit is invalid', async () => {
    await request(app.getHttpServer())
      .get('/clients?limit=-1')
      .set('x-api-key', apiKey)
      .expect(400)
      .expect(({ body }) => {
        const responseBody = body as { statusCode?: number; message?: string };
        expect(responseBody.statusCode).toBe(400);
        expect(responseBody.message).toContain('limit');
      });
  });
});
