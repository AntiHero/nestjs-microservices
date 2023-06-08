import { ClientsModule, Transport } from '@nestjs/microservices';
import { globalConfig } from '@app/common/config/global.config';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqService } from './rmq.service';

interface RmqModuleOptions {
  name: string;
}

@Module({
  imports: [],
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (
              configService: ConfigService<
                { global: ReturnType<typeof globalConfig> },
                true
              >,
            ) => {
              console.log(
                configService.get<string>('global.rabbit.uri', { infer: true }),
              );
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [
                    configService.get<string>('global.rabbit.uri', {
                      infer: true,
                    }),
                  ],
                  queue: 'main',
                },
              };
            },
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
