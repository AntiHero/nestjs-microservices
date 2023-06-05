import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentProvider } from '.prisma/subscriptions';

export class CheckoutDto {
  @IsEnum(PaymentProvider)
  @IsNotEmpty()
  public paymentSystem: PaymentProvider;

  @IsString()
  @IsNotEmpty()
  public priceId: string;
}
