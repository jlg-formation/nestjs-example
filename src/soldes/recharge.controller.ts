import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreateRechargeDto } from './dto/create-recharge.dto';
import { ClientDto } from './dto/client.dto';
import { RechargeService } from './recharge.service';

@Controller()
@UseGuards(ApiKeyGuard)
export class RechargeController {
  constructor(private readonly service: RechargeService) {}

  @Post('/recharge')
  async recharge(@Body() dto: CreateRechargeDto): Promise<ClientDto> {
    return this.service.recharge(dto);
  }
}
