import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { ClientsController } from './clients.controller';
import { ClientRepository } from './client.repository';
import { ClientsService } from './clients.service';
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
    ClientsService,
    RechargeService,
    ReservationService,
    ClientRepository,
    RechargeRepository,
    ReservationRepository,
    ApiKeyGuard,
  ],
})
export class SoldesModule {}
