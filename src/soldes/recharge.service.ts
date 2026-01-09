import { Injectable, NotFoundException } from '@nestjs/common';
import { RechargeRepository } from './recharge.repository';
import { CreateRechargeDto } from './dto/create-recharge.dto';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class RechargeService {
  constructor(private readonly rechargeRepo: RechargeRepository) {}

  async recharge(dto: CreateRechargeDto): Promise<ClientDto> {
    const updated = await this.rechargeRepo.applyRecharge(
      dto.clientId,
      dto.amount,
    );

    if (!updated) {
      throw new NotFoundException('Client not found');
    }

    return updated;
  }
}
