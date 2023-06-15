import { BanSearchStatus, SortDirection } from '@app/common/enums';
import { registerEnumType } from '@nestjs/graphql';
import { InputType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

registerEnumType(SortDirection, {
  name: 'SortDirectionType',
  description: '[asc, desc]',
});

registerEnumType(BanSearchStatus, {
  name: 'BanSearchStatusType',
  description: '[all, active, banned]',
});

@InputType()
export class PaginationQuery {
  @Field()
  @IsNumber()
  @Transform(({ value }) => {
    const parsedValue = parseInt(value);

    return parsedValue > 0 ? parsedValue : 1;
  })
  page: number;

  @Field()
  @IsNumber()
  @Transform(({ value }) => {
    const parsedValue = parseInt(value);

    return parsedValue > 0 ? parsedValue : 9;
  })
  pageSize: number;
}
