import { Injectable } from '@nestjs/common';

@Injectable()
export class SoldesService {
  getBalance(clientId: number): number {
    if (clientId <= 0) throw new Error('Invalid clientId');
    return 0;
  }
}
