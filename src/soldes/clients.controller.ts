import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { ClientBalanceDto } from './dto/client-balance.dto';
import { ClientsListResponseDto } from './dto/clients-list-response.dto';
import { ListClientsQueryDto } from './dto/list-clients-query.dto';
import { ClientsService } from './clients.service';
import { ClientDto } from './dto/client.dto';
import { SoldesService } from './soldes.service';

@Controller('clients')
@UseGuards(ApiKeyGuard)
@ApiTags('clients')
export class ClientsController {
  constructor(
    private readonly soldes: SoldesService,
    private readonly clients: ClientsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List clients' })
  @ApiOkResponse({ type: ClientsListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  async listClients(@Query() query: ListClientsQueryDto): Promise<ClientDto[]> {
    return this.clients.listClients(query);
  }

  @Get(':id/soldes')
  async getSoldes(@Param('id') id: string): Promise<ClientBalanceDto> {
    return this.soldes.getClientBalance(id);
  }
}
