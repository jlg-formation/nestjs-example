import { Body, Controller, Post } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ClientDto } from './dto/client.dto';
import { ReservationService } from './reservation.service';

@Controller()
export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  @Post('/reservation')
  async reserve(@Body() dto: CreateReservationDto): Promise<ClientDto> {
    return this.service.reserve(dto);
  }
}
