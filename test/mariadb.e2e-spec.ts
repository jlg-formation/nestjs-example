import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ClientRepository, DB_CLIENT } from '../src/soldes/client.repository';
import type { DbClient } from '../src/soldes/client.repository';

describe('MariaDB integration (e2e)', () => {
  let app: INestApplication<App>;
  let repo: ClientRepository;
  let db: DbClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repo = app.get(ClientRepository);
    db = app.get(DB_CLIENT);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should insert then retrieve a client row', async () => {
    const clientId = randomUUID();

    try {
      await repo.insert({ id: clientId, name: 'E2E Alice' });

      await expect(repo.findById(clientId)).resolves.toEqual({
        id: clientId,
        name: 'E2E Alice',
      });
    } finally {
      await db.query('DELETE FROM clients WHERE id = ?', [clientId]);
    }
  });
});
