import { Controller, Get, Param } from '@nestjs/common';
import { SoldesService } from './soldes.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly soldes: SoldesService) {}

  @Get(':id/soldes')
  getSoldes(@Param('id') id: string) {
    const clientId = Number(id);
    const balance = this.soldes.getBalance(clientId);
    return { clientId, balance };
  }
}
