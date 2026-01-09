import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RechargeRepository } from './recharge.repository';

@Injectable()
export class SoldesService {
  constructor(
    private readonly config: ConfigService,
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

  getBalance(clientId: number): number {
    if (clientId <= 0) throw new Error('Invalid clientId');
    return 0;
  }
}
