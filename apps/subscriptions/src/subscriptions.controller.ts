import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';

import { SubscriptionsQueryRepository } from './repositories/subscriptions.query-repository';
import { SUBSCRIPTIONS_PATTERNS } from '@app/common/patterns/subscriptions.patterns';

@Controller()
export class SubscriptionsController {
  public constructor(
    private readonly subscriptionsQueryRepository: SubscriptionsQueryRepository,
  ) {}

  @MessagePattern(SUBSCRIPTIONS_PATTERNS.GET_PRICES())
  public getPrices() {
    return this.subscriptionsQueryRepository.getPriceList();
  }
}
