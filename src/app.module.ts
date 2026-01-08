import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SoldesModule } from './soldes/soldes.module';

@Module({
  imports: [SoldesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
