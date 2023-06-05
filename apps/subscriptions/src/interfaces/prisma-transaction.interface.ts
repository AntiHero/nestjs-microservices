import { PrismaService } from 'apps/subscriptions/src/prisma/prisma.service';

export type PrismaTransactionType = Omit<
  PrismaService,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;
