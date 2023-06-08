import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { globalConfig } from '@app/common/config/global.config';

@Injectable()
export class RmqService {
  public constructor(
    private readonly configService: ConfigService<
      { global: ReturnType<typeof globalConfig> },
      true
    >,
  ) {
    console.log('here');
  }
  public getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          this.configService.get<string>('global.rabbit.uri', { infer: true }),
        ],
        queue,
        noAck,
        persistent: true,
      },
    };
  }

  public ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
