import { Injectable } from '@nestjs/common';
import type { ClientWithBalanceRow } from './client.repository';
import { ClientRepository } from './client.repository';
import { ClientDto } from './dto/client.dto';
import { ListClientsQueryDto } from './dto/list-clients-query.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly clientRepo: ClientRepository) {}

  async listClients(query: ListClientsQueryDto): Promise<ClientDto[]> {
    const repo = this.clientRepo as unknown as {
      findAllWithBalance(
        limit: number,
        offset: number,
      ): Promise<ClientWithBalanceRow[]>;
    };

    const rows = await repo.findAllWithBalance(query.limit, query.offset);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      balance: row.balance,
    }));
  }
}
