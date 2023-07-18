import { Transform }            from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class QueryDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value) || 1)
  public page?: number = 1;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value) || 9)
  public pageSize?: number = 9;
}
