import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientRepository, DB_CLIENT } from './client.repository';
import { SoldesController } from './soldes.controller';
import { SoldesService } from './soldes.service';

@Module({
  controllers: [SoldesController, ClientsController],
  providers: [
    SoldesService,
    ClientRepository,
    {
      provide: DB_CLIENT,
      useValue: {
        query: async (
          _sql: string,
          _params: readonly unknown[],
        ): Promise<[unknown[]]> => {
          throw new Error(
            'DB client not configured yet. Implement DB client wiring before using repositories.',
          );
        },
      },
    },
  ],
})
export class SoldesModule {}
