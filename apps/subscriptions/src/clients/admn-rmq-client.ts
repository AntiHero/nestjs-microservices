import { RmqClient }          from '@app/common/clients/rmq-client';
import { RmqClientToken }     from '@app/common/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy }        from '@nestjs/microservices';

@Injectable()
export class AdminRmqClient extends RmqClient {
  public constructor(@Inject(RmqClientToken.ADMIN_RMQ) client: ClientProxy) {
    super(client);
  }
}
