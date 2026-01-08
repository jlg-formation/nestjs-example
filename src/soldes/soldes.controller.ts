import { Body, Controller, Get, Post } from '@nestjs/common';
import { SoldesService } from './soldes.service';

@Controller('soldes')
export class SoldesController {
  constructor(private readonly soldes: SoldesService) {}

  @Get('ping')
  ping() {
    return this.soldes.ping();
  }

  @Post('recharge')
  recharge(@Body() body: { amount: number }) {
    return this.soldes.recharge(body.amount);
  }
}
