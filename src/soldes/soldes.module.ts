import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { ClientsController } from './clients.controller';
import { ClientRepository } from './client.repository';
import { RechargeController } from './recharge.controller';
import { RechargeRepository } from './recharge.repository';
import { RechargeService } from './recharge.service';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';
import { SoldesController } from './soldes.controller';
import { SoldesService } from './soldes.service';

@Module({
  imports: [DbModule],
  controllers: [
    SoldesController,
    ClientsController,
    RechargeController,
    ReservationController,
  ],
  providers: [
    SoldesService,
    RechargeService,
    ReservationService,
    ClientRepository,
    RechargeRepository,
    ReservationRepository,
  ],
})
export class SoldesModule {}
