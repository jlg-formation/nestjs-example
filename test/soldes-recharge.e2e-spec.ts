import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { App } from 'supertest/types';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ApiExceptionFilter } from '../src/common/filters/api-exception.filter';
import { ClientRepository, DB_CLIENT } from '../src/soldes/client.repository';
import { TestTxDbClient } from './utils/test-tx-db-client';

describe('POST /soldes/recharge (e2e)', () => {
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

  it('should insert a recharge when payload is valid', async () => {
    const clientId = randomUUID();

    await clientRepo.insert({ id: clientId, name: 'E2E Bob' });

    await request(app.getHttpServer())
      .post('/soldes/recharge')
      .set('x-api-key', apiKey)
      .send({ clientId, amount: 100 })
      .expect(201)
      .expect({ data: { ok: true } });

    const [rows] = await db.query(
      'SELECT id, client_id, amount FROM recharges WHERE client_id = ? AND amount = ?',
      [clientId, 100],
    );

    expect(rows.length).toBeGreaterThan(0);
  });

  it('should return a readable 400 when payload is invalid', async () => {
    const clientId = randomUUID();

    await request(app.getHttpServer())
      .post('/soldes/recharge')
      .set('x-api-key', apiKey)
      .send({ clientId, amount: -1 })
      .expect(400)
      .expect((res) => {
        const body = res.body as {
          statusCode?: number;
          errorCode?: string;
          message?: unknown;
        };

        expect(res.body).toMatchObject({
          statusCode: 400,
          errorCode: 'BAD_REQUEST',
        });

        const message = body.message;
        const messageText = Array.isArray(message)
          ? message.join('; ')
          : typeof message === 'string'
            ? message
            : '';

        expect(messageText).toContain('amount');
      });
  });
});
