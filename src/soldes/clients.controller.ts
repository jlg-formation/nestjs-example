import { Controller, Get, Param } from '@nestjs/common';
import { ClientBalanceDto } from './dto/client-balance.dto';
import { SoldesService } from './soldes.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly soldes: SoldesService) {}

  @Get(':id/soldes')
  async getSoldes(@Param('id') id: string): Promise<ClientBalanceDto> {
    return this.soldes.getClientBalance(id);
  }
}
