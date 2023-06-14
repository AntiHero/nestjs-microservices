import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const mongooseConfigFactory = (
  configService: ConfigService,
): TypegooseModuleOptions => {
  return {
    uri: <string>configService.get('MONGODB_URI'),
    useNewUrlParser: true,
  };
};
