import { Inject, Injectable } from '@nestjs/common';

export const DB_CLIENT = 'DB_CLIENT';

export interface DbTransactionClient {
  query(sql: string, params: readonly unknown[]): Promise<[unknown[]]>;
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  release(): Promise<void>;
}

export interface DbClient {
  query(sql: string, params: readonly unknown[]): Promise<[unknown[]]>;
  createTransaction(): Promise<DbTransactionClient>;
}

export type ClientRow = { id: string; name: string };
export type ClientWithBalanceRow = {
  id: string;
  name: string;
  balance: number;
};

@Injectable()
export class ClientRepository {
  constructor(@Inject(DB_CLIENT) private readonly db: DbClient) {}

  async findById(id: string): Promise<ClientRow | null> {
    const [rows] = await this.db.query(
      'SELECT id, name FROM clients WHERE id = ?',
      [id],
    );

    const first = (rows as ClientRow[])[0];
    return first ?? null;
  }

  async findByIdWithBalance(id: string): Promise<ClientWithBalanceRow | null> {
    const [rows] = await this.db.query(
      'SELECT id, name, balance FROM clients WHERE id = ?',
      [id],
    );

    const first = (rows as ClientWithBalanceRow[])[0];
    return first ?? null;
  }

  async findAllWithBalance(
    limit: number,
    offset: number,
  ): Promise<ClientWithBalanceRow[]> {
    const [rows] = await this.db.query(
      'SELECT id, name, balance FROM clients ORDER BY name, id LIMIT ? OFFSET ?',
      [limit, offset],
    );

    return rows as ClientWithBalanceRow[];
  }

  async insert(client: ClientRow): Promise<void> {
    await this.db.query('INSERT INTO clients (id, name) VALUES (?, ?)', [
      client.id,
      client.name,
    ]);
  }
}
