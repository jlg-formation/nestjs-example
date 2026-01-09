import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientBalanceDto } from './dto/client-balance.dto';
import { ClientRepository } from './client.repository';
import { RechargeRepository } from './recharge.repository';

@Injectable()
export class SoldesService {
  constructor(
    private readonly config: ConfigService,
    private readonly clientRepo: ClientRepository,
    private readonly rechargeRepo: RechargeRepository,
  ) {}

  getDbHost() {
    return this.config.get<string>('DB_HOST', 'localhost');
  }

  ping() {
    return { ok: true };
  }

  async recharge(clientId: string, amount: number): Promise<{ ok: true }> {
    const updated = await this.rechargeRepo.applyRecharge(clientId, amount);
    if (!updated) {
      throw new BadRequestException('Client not found');
    }

    return { ok: true };
  }

  async getClientBalance(clientId: string): Promise<ClientBalanceDto> {
    const client = await this.clientRepo.findByIdWithBalance(clientId);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return { clientId, balance: client.balance };
  }

  getBalance(clientId: number): number {
    if (clientId <= 0) throw new Error('Invalid clientId');
    return 0;
  }
}
