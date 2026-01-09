import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DB_CLIENT } from '../soldes/client.repository';
import { MysqlDbClient } from './mysql-db-client';

@Module({
  imports: [ConfigModule],
  providers: [
    MysqlDbClient,
    {
      provide: DB_CLIENT,
      useExisting: MysqlDbClient,
    },
  ],
  exports: [DB_CLIENT],
})
export class DbModule {}
