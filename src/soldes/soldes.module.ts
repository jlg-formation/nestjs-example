import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { SoldesController } from './soldes.controller';
import { SoldesService } from './soldes.service';

@Module({
  controllers: [SoldesController, ClientsController],
  providers: [SoldesService],
})
export class SoldesModule {}
