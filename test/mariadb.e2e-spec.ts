import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ClientRepository, DB_CLIENT } from '../src/soldes/client.repository';
import { TestTxDbClient } from './utils/test-tx-db-client';

describe('MariaDB integration (e2e)', () => {
  let app: INestApplication<App>;
  let repo: ClientRepository;
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
    await app.init();

    repo = app.get(ClientRepository);
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

  it('should insert then retrieve a client row', async () => {
    const clientId = randomUUID();

    await repo.insert({ id: clientId, name: 'E2E Alice' });

    await expect(repo.findById(clientId)).resolves.toEqual({
      id: clientId,
      name: 'E2E Alice',
    });
  });
});
