import { Injectable }     from '@nestjs/common';
import { OnEvent }        from '@nestjs/event-emitter';

import { Logger }         from './interfaces/logger.interface';
import { AdminRmqClient } from './services/admin-rmq-client.service';

export const NOTIFY_ADMIN_EVENT = 'notify_admin';

@Injectable()
export class EventRouter {
  public constructor(
    private readonly adminRmqClient: AdminRmqClient,
    private readonly logger: Logger,
  ) {}

  @OnEvent(NOTIFY_ADMIN_EVENT)
  public rootEvent<T>([event, payload]: [string, T]) {
    this.logger.debug(event, payload);
    this.adminRmqClient.emitMessage(event, payload);
  }
}
