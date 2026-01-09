import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { SoldesService } from './soldes.service';
import { CreateRechargeDto } from './dto/create-recharge.dto';

@Controller('soldes')
@UseGuards(ApiKeyGuard)
export class SoldesController {
  constructor(private readonly soldes: SoldesService) {}

  @Get('ping')
  ping() {
    return this.soldes.ping();
  }

  @Post('recharge')
  recharge(@Body() body: CreateRechargeDto) {
    return this.soldes.recharge(body.clientId, body.amount);
  }
}
