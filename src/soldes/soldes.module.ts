import { Module } from '@nestjs/common';
import { SoldesController } from './soldes.controller';
import { SoldesService } from './soldes.service';

@Module({
  controllers: [SoldesController],
  providers: [SoldesService],
})
export class SoldesModule {}
