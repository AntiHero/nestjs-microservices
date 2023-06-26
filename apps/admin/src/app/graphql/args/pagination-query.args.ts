import { BanFilter, SortDirection }               from '@app/common/enums';
import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Transform }                              from 'class-transformer';
import { IsEnum, IsNumber, IsString }             from 'class-validator';

registerEnumType(SortDirection, {
  name: 'SortDirectionType',
  description: `${Object.keys(SortDirection)}`,
});

registerEnumType(BanFilter, {
  name: 'BanFilterType',
  description: `${Object.keys(BanFilter)}`,
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

  @Field(() => SortDirection, {
    defaultValue: SortDirection.Desc,
  })
  @IsString()
  @IsEnum(SortDirection)
  sortDirection: SortDirection;
}
