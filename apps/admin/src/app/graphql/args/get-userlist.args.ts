import { BanSearchStatus, SortDirection } from '@app/common/enums';
import { ArgsType, Int, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
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
  @Field(() => Int)
  @IsNumber()
  @Transform(({ value }) => {
    const parsedValue = parseInt(value);

    return parsedValue > 0 ? parsedValue : 1;
  })
  page = 1;

  @Field(() => Int)
  @IsNumber()
  @Transform(({ value }) => {
    const parsedValue = parseInt(value);

    return parsedValue > 0 ? parsedValue : 9;
  })
  pageSize = 9;

  @Field(() => String)
  @Transform(({ value }) => {
    return value ? new RegExp(value, 'i') : /.*/;
  })
  searchUsernameTerm = '';

  @Field(() => SortDirection, {
    defaultValue: SortDirection.Desc,
  })
  @IsString()
  @IsEnum(SortDirection)
  sortDirection: SortDirection;
}
