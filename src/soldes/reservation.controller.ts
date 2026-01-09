import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ClientDto } from './dto/client.dto';
import { ReservationService } from './reservation.service';

@Controller()
@UseGuards(ApiKeyGuard)
export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  @Post('/reservation')
  async reserve(@Body() dto: CreateReservationDto): Promise<ClientDto> {
    return this.service.reserve(dto);
  }
}
