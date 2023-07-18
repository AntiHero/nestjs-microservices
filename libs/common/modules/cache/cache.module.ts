import { CacheModule as OriginalCacheModule } from '@nestjs/cache-manager';
import { Global, Module }                     from '@nestjs/common';
import { ConfigService }                      from '@nestjs/config';

import { GlobalConfig }                       from '@app/common/config/global.config';

@Global()
@Module({
  imports: [
    OriginalCacheModule.registerAsync({
      useFactory: (
        config: ConfigService<{ global: GlobalConfig['cache'] }>,
      ) => ({
        ttl: config.get<number>('global.cache.ttl', { infer: true }),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [OriginalCacheModule],
})
export class CacheModule {}
