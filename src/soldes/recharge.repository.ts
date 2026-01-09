import { Inject, Injectable } from '@nestjs/common';

import { DB_CLIENT } from './client.repository';
import type { DbClient } from './client.repository';

@Injectable()
export class RechargeRepository {
  constructor(@Inject(DB_CLIENT) private readonly db: DbClient) {}

  async clientExists(clientId: string): Promise<boolean> {
    const [rows] = await this.db.query(
      'SELECT id FROM clients WHERE id = ? LIMIT 1',
      [clientId],
    );

    return ((rows as Array<{ id: string }>)[0] ?? null) !== null;
  }

  async insertRecharge(clientId: string, amount: number): Promise<void> {
    await this.db.query(
      'INSERT INTO recharges (client_id, amount) VALUES (?, ?)',
      [clientId, amount],
    );
  }
}
