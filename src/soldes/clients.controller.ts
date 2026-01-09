import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse } from '../common/dto/api-response';
import { ClientBalanceDto } from './dto/client-balance.dto';
import { SoldesService } from './soldes.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly soldes: SoldesService) {}

  @Get(':id/soldes')
  async getSoldes(
    @Param('id') id: string,
  ): Promise<ApiResponse<ClientBalanceDto>> {
    const dto = await this.soldes.getClientBalance(id);
    return { data: dto };
  }
}
