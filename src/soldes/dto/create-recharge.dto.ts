import { IsInt, IsPositive, IsString, Length } from 'class-validator';

export class CreateRechargeDto {
  @IsString()
  @Length(3, 36)
  clientId!: string;

  @IsInt()
  @IsPositive()
  amount!: number;
}
