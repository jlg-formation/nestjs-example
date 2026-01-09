import { createConnection } from 'mysql2/promise';
import type { Connection } from 'mysql2/promise';

import type {
  DbClient,
  DbTransactionClient,
} from '../../src/soldes/client.repository';

export class TestTxDbClient implements DbClient {
  private connection: Connection | null = null;
  private savepointCounter = 0;

  async connect(): Promise<void> {
    if (this.connection) {
      return;
    }

    const host = process.env.DB_HOST ?? 'localhost';
    const port = Number(process.env.DB_PORT ?? 3306);
    const user = process.env.DB_USER ?? 'root';
    const password = process.env.DB_PASSWORD ?? 'devroot';
    const database = process.env.DB_NAME ?? 'nestjs_example';

    this.connection = await createConnection({
      host,
      port,
      user,
      password,
      database,
    });
  }

  async close(): Promise<void> {
    const connection = this.connection;
    this.connection = null;

    if (!connection) {
      return;
    }

    await connection.end();
  }

  private getConnectionOrThrow(): Connection {
    if (!this.connection) {
      throw new Error('TestTxDbClient is not connected. Call connect() first.');
    }

    return this.connection;
  }

  async beginTestTransaction(): Promise<void> {
    const connection = this.getConnectionOrThrow();
    this.savepointCounter = 0;
    await connection.beginTransaction();
  }

  async rollbackTestTransaction(): Promise<void> {
    const connection = this.getConnectionOrThrow();
    await connection.rollback();
  }

  async query(sql: string, params: readonly unknown[]): Promise<[unknown[]]> {
    const connection = this.getConnectionOrThrow();
    const [rows] = await connection.query(sql, params as unknown[]);
    return [rows as unknown[]];
  }

  createTransaction(): Promise<DbTransactionClient> {
    const connection = this.getConnectionOrThrow();
    const savepointName = `sp_${++this.savepointCounter}`;
    let started = false;

    return Promise.resolve({
      begin: async () => {
        if (started) {
          return;
        }

        await connection.query(`SAVEPOINT ${savepointName}`);
        started = true;
      },
      commit: async () => {
        if (!started) {
          return;
        }

        await connection.query(`RELEASE SAVEPOINT ${savepointName}`);
        started = false;
      },
      rollback: async () => {
        if (!started) {
          return;
        }

        await connection.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        await connection.query(`RELEASE SAVEPOINT ${savepointName}`);
        started = false;
      },
      query: async (sql: string, params: readonly unknown[]) => {
        const [rows] = await connection.query(sql, params as unknown[]);
        return [rows as unknown[]];
      },
      release: () => Promise.resolve(),
    });
  }
}
