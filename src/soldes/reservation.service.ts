import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ClientRepository } from './client.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ClientDto } from './dto/client.dto';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly clientRepo: ClientRepository,
    private readonly reservationRepo: ReservationRepository,
  ) {}

  async reserve(dto: CreateReservationDto): Promise<ClientDto> {
    const client = await this.clientRepo.findById(dto.clientId);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const updated = await this.reservationRepo.applyReservation(
      dto.clientId,
      dto.reference,
      dto.amount,
    );

    if (!updated) {
      throw new BadRequestException('Insufficient funds');
    }

    return updated;
  }
}
