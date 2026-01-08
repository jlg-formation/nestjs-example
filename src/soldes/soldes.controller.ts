import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('soldes')
export class SoldesController {
  @Get('ping')
  ping() {
    return { ok: true };
  }

  @Post('recharge')
  recharge(@Body() body: { amount: number }) {
    return { ok: true, amount: body.amount };
  }
}
