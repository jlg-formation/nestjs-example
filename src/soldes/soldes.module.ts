import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { ClientsController } from './clients.controller';
import { ClientRepository } from './client.repository';
import { SoldesController } from './soldes.controller';
import { SoldesService } from './soldes.service';

@Module({
  imports: [DbModule],
  controllers: [SoldesController, ClientsController],
  providers: [SoldesService, ClientRepository],
})
export class SoldesModule {}
