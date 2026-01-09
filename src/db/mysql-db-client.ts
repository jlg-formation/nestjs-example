import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool, Pool } from 'mysql2/promise';
import type { DbClient } from '../soldes/client.repository';

@Injectable()
export class MysqlDbClient implements DbClient, OnModuleDestroy {
  private readonly pool: Pool;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('DB_HOST', 'localhost');
    const port = this.config.get<number>('DB_PORT', 3306);
    const user = this.config.get<string>('DB_USER', 'root');
    const password = this.config.get<string>('DB_PASSWORD', 'devroot');
    const database = this.config.get<string>('DB_NAME', 'nestjs_example');

    this.pool = createPool({
      host,
      port,
      user,
      password,
      database,
      connectionLimit: 10,
    });
  }

  async query(sql: string, params: readonly unknown[]): Promise<[unknown[]]> {
    const [rows] = await this.pool.query(sql, params as unknown[]);
    return [rows as unknown[]];
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
