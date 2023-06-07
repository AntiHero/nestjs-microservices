import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentProvider } from '.prisma/subscriptions';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { PAYMENT_SERVICES } from '../constants';
import { RootServiceAdapter } from '../services/root.service-adapter';
import { PaymentProviderService } from '../services/payment-provider.service';

export class CreateCustomerIfNotExistsCommand {
  public constructor(
    public readonly userId: string,
    public readonly provider: PaymentProvider,
  ) {}
}

type PaymentServicesMap = {
  [key in PaymentProvider]?: PaymentProviderService;
};

@CommandHandler(CreateCustomerIfNotExistsCommand)
export class CreateCustomerIfNotExistsCommandHandler
  implements ICommandHandler<CreateCustomerIfNotExistsCommand>
{
  public paymentServicesMap: PaymentServicesMap;

  public constructor(
    @Inject(PAYMENT_SERVICES)
    private readonly paymentServices: PaymentProviderService[], // private readonly usersRepository: UserRepository,
    private readonly rootService: RootServiceAdapter,
  ) {
    this.paymentServicesMap = Object.fromEntries(
      this.paymentServices.map((service) => [service.provider, service]),
    );
  }

  public async execute(command: CreateCustomerIfNotExistsCommand) {
    const { userId, provider } = command;

    const result = await firstValueFrom(this.rootService.getUserInfo(userId));

    if (!result) return;

    return this.paymentServicesMap[provider]?.createCustomerIfNotExists(
      result.email,
      result.username,
    );
  }
}
