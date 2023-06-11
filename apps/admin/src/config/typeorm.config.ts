import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

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
    migrations: ['./dist/apps/admin/migrations/**/*{.ts,.js}'],
  };
};
