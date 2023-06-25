import { BadRequestException } from '@nestjs/common';
import { Transform }           from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  Length,
  NotEquals,
  ValidateIf,
} from 'class-validator';
import { format, parseISO }    from 'date-fns';

import {
  ABOUT_ME_LENGTH_MAX,
  ABOUT_ME_LENGTH_MIN,
  CITY_LENGTH_MAX,
  CITY_LENGTH_MIN,
  NAME_LENGTH_MAX,
  NAME_LENGTH_MIN,
  SURNAME_LENGTH_MAX,
  SURNAME_LENGTH_MIN,
  USERNAME_LENGTH_MAX,
  USERNAME_LENGTH_MIN,
} from 'apps/root/src/common/constants';

export class UpdateUserProfileDto {
  @Length(USERNAME_LENGTH_MIN, USERNAME_LENGTH_MAX)
  @IsString()
  @IsOptional()
  @NotEquals(null)
  @ValidateIf((_, value) => value !== undefined)
  public username?: string;

  @Length(NAME_LENGTH_MIN, NAME_LENGTH_MAX)
  @IsString()
  @IsOptional()
  @NotEquals(null)
  @ValidateIf((_, value) => value !== undefined)
  public name?: string;

  @Length(SURNAME_LENGTH_MIN, SURNAME_LENGTH_MAX)
  @IsString()
  @IsOptional()
  @NotEquals(null)
  @ValidateIf((_, value) => value !== undefined)
  public surname?: string;

  @Transform(({ value }) => {
    try {
      return new Date(format(parseISO(value), 'yyyy-MM-dd'));
    } catch (error) {
      throw new BadRequestException(
        'Invalid time value. Birthday must be ISOString of format yyyy-MM-dd',
      );
    }
  })
  @IsDate({ message: 'birthday must be ISOString of format yyyy-MM-dd' })
  @IsOptional()
  /* TODO compare with min age of registraton */
  public birthday?: Date;

  @Length(CITY_LENGTH_MIN, CITY_LENGTH_MAX)
  @IsString()
  @IsOptional()
  @NotEquals(null)
  @ValidateIf((_, value) => value !== undefined)
  public city?: string;

  @Length(ABOUT_ME_LENGTH_MIN, ABOUT_ME_LENGTH_MAX)
  @IsString()
  @IsOptional()
  public aboutMe?: string;
}
