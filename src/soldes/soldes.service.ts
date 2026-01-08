import { Injectable } from '@nestjs/common';

@Injectable()
export class SoldesService {
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
