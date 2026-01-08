import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SoldesService {
  constructor(private readonly config: ConfigService) {}

  getDbHost() {
    return this.config.get<string>('DB_HOST', 'localhost');
  }

  ping() {
    return { ok: true };
  }

  recharge(amount: number) {
    return { ok: true, amount };
  }

  getBalance(clientId: number): number {
    if (clientId <= 0) throw new Error('Invalid clientId');
    return 0;
  }
}
