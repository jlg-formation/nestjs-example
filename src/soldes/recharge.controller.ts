import { Body, Controller, Post } from '@nestjs/common';
import { CreateRechargeDto } from './dto/create-recharge.dto';
import { ClientDto } from './dto/client.dto';
import { RechargeService } from './recharge.service';

@Controller()
export class RechargeController {
  constructor(private readonly service: RechargeService) {}

  @Post('/recharge')
  async recharge(@Body() dto: CreateRechargeDto): Promise<ClientDto> {
    return this.service.recharge(dto);
  }
}
