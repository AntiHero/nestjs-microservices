import {
  ClientProxy,
  RmqRecord,
  RmqRecordBuilder,
} from '@nestjs/microservices';

export abstract class RmqClient {
  public constructor(public readonly client: ClientProxy) {}

  public emitMessage<T>(pattern: string, message: T) {
    const record = new RmqRecordBuilder(message)
      .setOptions({
        expiration: 60_000 * 24,
      })
      .build();

    return this.client.emit<string, RmqRecord<T>>(pattern, record);
  }
}
