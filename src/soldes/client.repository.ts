import { Inject, Injectable } from '@nestjs/common';

export const DB_CLIENT = 'DB_CLIENT';

export interface DbClient {
  query(sql: string, params: readonly unknown[]): Promise<[unknown[]]>;
}

export type ClientRow = { id: string; name: string };

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

  async insert(client: ClientRow): Promise<void> {
    await this.db.query('INSERT INTO clients (id, name) VALUES (?, ?)', [
      client.id,
      client.name,
    ]);
  }
}
