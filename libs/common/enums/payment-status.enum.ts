import { PaymentStatus as PaymentStatusEnum } from '.prisma/subscriptions';

export const PaymentStatus: typeof PaymentStatusEnum = {
  CONFIRMED: 'CONFIRMED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
};

export type PaymentStatus = PaymentStatusEnum;
