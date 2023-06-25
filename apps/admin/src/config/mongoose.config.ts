import { ConfigService }          from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const mongooseConfigFactory = (
  configService: ConfigService<{ MONGODB_URI: string }, true>,
): TypegooseModuleOptions => {
  return {
    uri: configService.get('MONGODB_URI', { infer: true }),
    useNewUrlParser: true,
  };
};
