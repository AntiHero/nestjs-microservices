/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionPrice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionPricingPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_subscriptionPaymentId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionPayment" DROP CONSTRAINT "SubscriptionPayment_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionPayment" DROP CONSTRAINT "SubscriptionPayment_pricingPlanId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionPricingPlan" DROP CONSTRAINT "SubscriptionPricingPlan_priceId_fkey";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "SubscriptionPayment";

-- DropTable
DROP TABLE "SubscriptionPrice";

-- DropTable
DROP TABLE "SubscriptionPricingPlan";

-- DropEnum
DROP TYPE "Currency";

-- DropEnum
DROP TYPE "PaymentProvider";

-- DropEnum
DROP TYPE "PaymentReference";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PeriodType";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "SubscriptionType";
