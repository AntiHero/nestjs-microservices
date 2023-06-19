import { Inject, Injectable } from '@nestjs/common';
import {
  ClientProxy,
  RmqRecord,
  RmqRecordBuilder,
} from '@nestjs/microservices';

@Injectable()
export class AdminRmqClient {
  public constructor(
    @Inject('ADMIN_RMQ') private readonly adminRmqClient: ClientProxy,
  ) {}

  public emitMessage<T>(pattern: string, message: T) {
    const record = new RmqRecordBuilder(message)
      .setOptions({
        expiration: 60_000 * 24,
      })
      .build();

    this.adminRmqClient.emit<string, RmqRecord<T>>(pattern, record);
  }
}
