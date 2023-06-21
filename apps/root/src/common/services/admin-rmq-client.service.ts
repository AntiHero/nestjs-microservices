import { RmqClient }          from '@app/common/clients/rmq-client';
import { Inject, Injectable } from '@nestjs/common';
import {
  ClientProxy,
  // RmqRecord,
  // RmqRecordBuilder,
}                             from '@nestjs/microservices';

@Injectable()
export class AdminRmqClient extends RmqClient {
  public constructor(@Inject('ADMIN_RMQ') client: ClientProxy) {
    super(client);
  }
}
