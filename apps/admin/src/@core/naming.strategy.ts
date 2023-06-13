import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PluralNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, customName: string): string {
    return customName ? customName : `${className.toLowerCase()}s`;
  }
}
