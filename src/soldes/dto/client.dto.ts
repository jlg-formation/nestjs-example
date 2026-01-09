import { ApiProperty } from '@nestjs/swagger';

export class ClientDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'Alice' })
  name!: string;

  @ApiProperty({ example: 0 })
  balance!: number;
}
