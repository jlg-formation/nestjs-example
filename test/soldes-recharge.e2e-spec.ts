import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { App } from 'supertest/types';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ApiExceptionFilter } from '../src/common/filters/api-exception.filter';
import { ClientRepository, DB_CLIENT } from '../src/soldes/client.repository';
import type { DbClient } from '../src/soldes/client.repository';

describe('POST /soldes/recharge (e2e)', () => {
  let app: INestApplication<App>;
  let clientRepo: ClientRepository;
  let db: DbClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
    db = app.get(DB_CLIENT);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should insert a recharge when payload is valid', async () => {
    const clientId = randomUUID();

    try {
      await clientRepo.insert({ id: clientId, name: 'E2E Bob' });

      await request(app.getHttpServer())
        .post('/soldes/recharge')
        .send({ clientId, amount: 100 })
        .expect(201)
        .expect({ ok: true });

      const [rows] = await db.query(
        'SELECT id, client_id, amount FROM recharges WHERE client_id = ? AND amount = ?',
        [clientId, 100],
      );

      expect(rows.length).toBeGreaterThan(0);
    } finally {
      await db.query('DELETE FROM recharges WHERE client_id = ?', [clientId]);
      await db.query('DELETE FROM clients WHERE id = ?', [clientId]);
    }
  });

  it('should return a readable 400 when payload is invalid', async () => {
    const clientId = randomUUID();

    await request(app.getHttpServer())
      .post('/soldes/recharge')
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
