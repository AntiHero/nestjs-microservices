import { BanSearchStatus, SortDirection } from '@app/common/enums';
import { ArgsType, Int, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Field } from '@nestjs/graphql';

registerEnumType(SortDirection, {
  name: 'SortDirectionType',
  description: `${Object.keys(SortDirection)}`,
});

registerEnumType(BanSearchStatus, {
  name: 'BanSearchStatusType',
  description: `${Object.keys(BanSearchStatus)}`,
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
