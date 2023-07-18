import { RmqClient }          from '@app/common/clients/rmq-client';
import { RmqClientToken }     from '@app/common/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy }        from '@nestjs/microservices';

@Injectable()
export class RootRmqClient extends RmqClient {
  public constructor(@Inject(RmqClientToken.ROOT_RMQ) client: ClientProxy) {
    super(client);
  }
}
