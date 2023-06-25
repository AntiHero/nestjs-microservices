import fs                                           from 'node:fs';
import { resolve }                                  from 'node:path';

import { PrismaClient as PrismaSubscriptionClient } from '.prisma/subscriptions';
import { PrismaClient }                             from '@prisma/client';
import mongoose                                     from 'mongoose';

import { PostModel }                                from 'apps/admin/src/app/entity/post.model';

const prisma = new PrismaClient();
const prismaSubscription = new PrismaSubscriptionClient();

async function connectToMongo(uri: string) {
  await mongoose.connect(uri).then(() => console.log('mongo connected'));
}

async function writeFile<T>(name: string, data: T[]) {
  await new Promise<void>((res, rej) =>
    fs.writeFile(
      resolve(__dirname, `${name}.json`),
      JSON.stringify(data),
      { flag: 'w' },
      (err) => {
        if (err) rej(err);

        res();
      },
    ),
  );
}

async function writeToMongo<T>(
  name: string,
  data: mongoose.mongo.OptionalId<T>[],
) {
  const collection = mongoose.connection.collection(name);
  collection.insertMany(data);
}

async function getUserData(): Promise<any> {
  try {
    const result = await prisma.user.findMany({
      where: {},
      include: {
        avatar: {
          select: {
            id: true,
            url: true,
            previewUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        profile: true,
      },
    });

    await Promise.all([writeFile('users', result)]);
  } catch (error: any) {
    console.log(error);

    throw new Error(error.message);
  }
}

async function getPostsData(): Promise<any> {
  try {
    const result = await prisma.post.findMany({
      where: {},
      select: {
        id: true,
        userId: true,
        description: true,
        createdAt: true,
        images: {
          select: {
            id: true,
            url: true,
            previewUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    await Promise.all([writeFile('posts', result)]);
  } catch (error: any) {
    console.log(error);

    throw new Error(error.message);
  }
}

async function getSubscriptionsData() {
  try {
    const result = await prismaSubscription.payment.findMany({
      where: {},
      select: {
        id: true,
        price: true,
        currency: true,
        provider: true,
        status: true,
        subscriptionPayment: {
          select: {
            subscription: {
              select: {
                endDate: true,
                startDate: true,
                type: true,
              },
            },
            pricingPlan: {
              select: {
                price: {
                  select: {
                    period: true,
                    periodType: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const subscriptions = result.map(({ subscriptionPayment, ...rest }) => {
      const result = {
        ...rest,
        endDate: subscriptionPayment?.subscription?.endDate,
        startDate: subscriptionPayment?.subscription?.startDate,
        type: subscriptionPayment?.subscription?.type,
        period: subscriptionPayment?.pricingPlan?.price?.period,
        periodType: subscriptionPayment?.pricingPlan?.price?.periodType,
      };
    });

    await Promise.all([writeFile('subscriptions', result)]);
  } catch (error: any) {
    console.log(error);

    throw new Error(error.message);
  }
}

getUserData()
  .then(getPostsData)
  .then(getSubscriptionsData)
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await Promise.all([prisma.$disconnect(), prismaSubscription.$disconnect()]);
    console.log('completed');
  });
