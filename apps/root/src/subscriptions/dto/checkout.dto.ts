import { PaymentProvider }              from '.prisma/subscriptions';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CheckoutDto {
  @IsEnum(PaymentProvider)
  @IsNotEmpty()
  public paymentSystem: PaymentProvider;

  @IsString()
  @IsNotEmpty()
  public priceId: string;
}
