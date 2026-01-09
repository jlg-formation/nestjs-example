import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '../common/dto/api-response';
import { CreateRechargeDto } from './dto/create-recharge.dto';
import { ClientDto } from './dto/client.dto';
import { RechargeService } from './recharge.service';

@Controller()
export class RechargeController {
  constructor(private readonly service: RechargeService) {}

  @Post('/recharge')
  async recharge(
    @Body() dto: CreateRechargeDto,
  ): Promise<ApiResponse<ClientDto>> {
    const client = await this.service.recharge(dto);
    return { data: client };
  }
}
