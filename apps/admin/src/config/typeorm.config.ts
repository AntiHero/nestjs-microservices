import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { PluralNamingStrategy } from '../@core/naming.strategy';

export const postgresConfigFactory = async (
  configService: ConfigService<{ DATABASE_URL: string; MODE: string }, true>,
): Promise<TypeOrmModuleOptions> => {
  const mode = configService.get('MODE', { infer: true });
  const url = configService.get('DATABASE_URL', { infer: true });
  const namingStrategy = new PluralNamingStrategy();
  const logging = mode === 'production' ? false : 'all';
  const migrations = [__dirname + '/migrations/**/*{.ts,.js}'];

  return {
    type: 'postgres',
    url,
    logging,
    migrations,
    namingStrategy,
    ssl: false,
    entities: [],
    synchronize: false,
    autoLoadEntities: true,
  };
};
