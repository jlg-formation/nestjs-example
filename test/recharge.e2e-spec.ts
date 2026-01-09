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

  beforeAll(async () => {
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

  it('should return { data } when payload is valid', async () => {
    const clientId = randomUUID();

    await clientRepo.insert({ id: clientId, name: 'E2E Bob' });

    await request(app.getHttpServer())
      .post('/recharge')
      .send({ clientId, amount: 10 })
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
        expect(responseBody.data?.balance).toBeGreaterThan(0);
      });
  });
});
