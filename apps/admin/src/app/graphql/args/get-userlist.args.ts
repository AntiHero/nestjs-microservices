import { BanSearchStatus, SortDirection } from '@app/common/enums';
import { ArgsType, registerEnumType } from '@nestjs/graphql';
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
