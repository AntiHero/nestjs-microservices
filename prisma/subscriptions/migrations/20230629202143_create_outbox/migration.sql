-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "base";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "outbox";

-- CreateEnum
CREATE TYPE "base"."Currency" AS ENUM ('USD');

-- CreateEnum
CREATE TYPE "base"."PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "base"."PaymentReference" AS ENUM ('SUBSCRIPTION', 'OTHER');

-- CreateEnum
CREATE TYPE "base"."PaymentProvider" AS ENUM ('STRIPE', 'PAYPAL');

-- CreateEnum
CREATE TYPE "base"."SubscriptionType" AS ENUM ('ONETIME', 'RECCURING');

-- CreateEnum
CREATE TYPE "base"."SubscriptionStatus" AS ENUM ('ACTIVE', 'PENDING', 'CANCELLED');

-- CreateEnum
CREATE TYPE "base"."PeriodType" AS ENUM ('DAY', 'MONTH', 'YEAR');

-- CreateEnum
CREATE TYPE "outbox"."DeliveryStatus" AS ENUM ('SENT', 'FAILED', 'PENDING');

-- CreateTable
CREATE TABLE "base"."Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" "base"."Currency" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "base"."PaymentStatus" NOT NULL,
    "reference" "base"."PaymentReference" NOT NULL DEFAULT 'SUBSCRIPTION',
    "provider" "base"."PaymentProvider" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."SubscriptionPayment" (
    "id" TEXT NOT NULL,
    "info" JSONB,
    "paymentId" TEXT NOT NULL,
    "pricingPlanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."SubscriptionPricingPlan" (
    "id" TEXT NOT NULL,
    "providerPriceId" TEXT NOT NULL,
    "provider" "base"."PaymentProvider" NOT NULL,
    "subscriptionType" "base"."SubscriptionType" NOT NULL,
    "priceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPricingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."SubscriptionPrice" (
    "id" TEXT NOT NULL,
    "currency" "base"."Currency" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "period" INTEGER NOT NULL,
    "periodType" "base"."PeriodType" NOT NULL DEFAULT 'MONTH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."Subscription" (
    "id" TEXT NOT NULL,
    "endDate" TIMESTAMPTZ(3),
    "startDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "relatedSubscription" TEXT,
    "status" "base"."SubscriptionStatus" NOT NULL,
    "type" "base"."SubscriptionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionPaymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox"."Outbox" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "message" JSONB NOT NULL,
    "deliveryStatus" "outbox"."DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPayment_paymentId_key" ON "base"."SubscriptionPayment"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionPaymentId_key" ON "base"."Subscription"("subscriptionPaymentId");

-- AddForeignKey
ALTER TABLE "base"."SubscriptionPayment" ADD CONSTRAINT "SubscriptionPayment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "base"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."SubscriptionPayment" ADD CONSTRAINT "SubscriptionPayment_pricingPlanId_fkey" FOREIGN KEY ("pricingPlanId") REFERENCES "base"."SubscriptionPricingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."SubscriptionPricingPlan" ADD CONSTRAINT "SubscriptionPricingPlan_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "base"."SubscriptionPrice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."Subscription" ADD CONSTRAINT "Subscription_subscriptionPaymentId_fkey" FOREIGN KEY ("subscriptionPaymentId") REFERENCES "base"."SubscriptionPayment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
