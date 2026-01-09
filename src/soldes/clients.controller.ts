import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { ClientBalanceDto } from './dto/client-balance.dto';
import { SoldesService } from './soldes.service';

@Controller('clients')
@UseGuards(ApiKeyGuard)
export class ClientsController {
  constructor(private readonly soldes: SoldesService) {}

  @Get(':id/soldes')
  async getSoldes(@Param('id') id: string): Promise<ClientBalanceDto> {
    return this.soldes.getClientBalance(id);
  }
}
