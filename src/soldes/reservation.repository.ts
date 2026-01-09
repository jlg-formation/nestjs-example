import { Inject, Injectable } from '@nestjs/common';

import { DB_CLIENT } from './client.repository';
import type { DbClient } from './client.repository';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class ReservationRepository {
  constructor(@Inject(DB_CLIENT) private readonly db: DbClient) {}

  async applyReservation(
    clientId: string,
    reference: string,
    amount: number,
  ): Promise<ClientDto | null> {
    const tx = await this.db.createTransaction();
    await tx.begin();

    try {
      const [result] = await tx.query(
        'UPDATE clients SET balance = balance - ? WHERE id = ? AND balance >= ?',
        [amount, clientId, amount],
      );

      const affectedRows = (result as unknown as { affectedRows?: number })
        .affectedRows;

      if (affectedRows !== 1) {
        await tx.rollback();
        return null;
      }

      await tx.query(
        'INSERT INTO reservations (client_id, reference, amount) VALUES (?, ?, ?)',
        [clientId, reference, amount],
      );

      const [rows] = await tx.query(
        'SELECT id, name, balance FROM clients WHERE id = ?',
        [clientId],
      );

      await tx.commit();
      return (rows as ClientDto[])[0] ?? null;
    } catch (error) {
      await tx.rollback();
      throw error;
    } finally {
      await tx.release();
    }
  }
}
