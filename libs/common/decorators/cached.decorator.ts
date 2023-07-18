import { CacheInterceptor } from '@nestjs/cache-manager';
import { UseInterceptors }  from '@nestjs/common';

export const Cached = () => UseInterceptors(CacheInterceptor);
