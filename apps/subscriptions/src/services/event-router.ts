import { SubscriptionCommand } from '@app/common/patterns/subscriptions.pattern';
import { Injectable }          from '@nestjs/common';
import { OnEvent }             from '@nestjs/event-emitter';

import { RootRmqClient }       from '../clients/root-rmq.client';

interface EventPayload<T> {
  event: string;
  message: T;
}

@Injectable()
export class EventRouter {
  public constructor(private readonly rootRmqClient: RootRmqClient) {}

  @OnEvent(SubscriptionCommand.UpdateUserAccountPlan)
  public notifyRootMicroservice<T>({ event, message }: EventPayload<T>) {
    this.rootRmqClient.emitMessage(event, message);
  }
}
