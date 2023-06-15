import { BanSearchStatus, SortDirection } from '@app/common/enums';
import { ArgsType, registerEnumType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Field } from '@nestjs/graphql';

registerEnumType(SortDirection, {
  name: 'SortDirectionType',
  description: '[asc, desc]',
});

registerEnumType(BanSearchStatus, {
  name: 'BanSearchStatusType',
  description: '[all, active, banned]',
});

@ArgsType()
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
