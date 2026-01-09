import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { RechargeRepository } from './recharge.repository';
import { CreateRechargeDto } from './dto/create-recharge.dto';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class RechargeService {
  constructor(
    private readonly clientRepo: ClientRepository,
    private readonly rechargeRepo: RechargeRepository,
  ) {}

  async recharge(dto: CreateRechargeDto): Promise<ClientDto> {
    const existing = await this.clientRepo.findByIdWithBalance(dto.clientId);
    if (!existing) {
      throw new BadRequestException('Client not found');
    }

    await this.rechargeRepo.insertRecharge(dto.clientId, dto.amount);
    await this.rechargeRepo.incrementBalance(dto.clientId, dto.amount);

    const updated = await this.clientRepo.findByIdWithBalance(dto.clientId);
    if (!updated) {
      throw new BadRequestException('Client not found');
    }

    return {
      id: updated.id,
      name: updated.name,
      balance: updated.balance,
    };
  }
}
