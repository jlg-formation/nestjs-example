import { IsInt, IsPositive, IsString, Length } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @Length(3, 36)
  clientId!: string;

  @IsString()
  @Length(3, 40)
  reference!: string;

  @IsInt()
  @IsPositive()
  amount!: number;
}
