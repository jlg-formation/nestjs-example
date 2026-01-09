import { ApiProperty } from '@nestjs/swagger';
import { ClientDto } from './client.dto';

export class ClientsListResponseDto {
  @ApiProperty({ type: () => [ClientDto] })
  data!: ClientDto[];
}
