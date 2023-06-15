import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { PluralNamingStrategy } from '../@core/naming.strategy';

export const postgresConfigFactory = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const MODE = configService.get('MODE');

  return {
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    entities: [],
    synchronize: false,
    autoLoadEntities: true,
    logging: MODE === 'production' ? false : 'all',
    ssl: false,
    // ssl: MODE === 'production' ? true : false,
    namingStrategy: new PluralNamingStrategy(),
    // migrations: ['./dist/apps/admin/migrations/**/*{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  };
};
