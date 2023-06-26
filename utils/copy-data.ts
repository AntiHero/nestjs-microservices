import fs                                           from 'node:fs';
import { resolve }                                  from 'node:path';

import { PrismaClient as PrismaSubscriptionClient } from '.prisma/subscriptions';
import { PrismaClient }                             from '@prisma/client';
import { config }                                   from 'dotenv';
import mongoose                                     from 'mongoose';

import { PaymentModel }                             from 'apps/admin/src/app/entity/payments.model';
import { PostModel }                                from 'apps/admin/src/app/entity/post.model';
import { UserModel }                                from 'apps/admin/src/app/entity/user.model';

config({
  path: 'apps/admin/.env',
});

const prisma = new PrismaClient();
const prismaSubscription = new PrismaSubscriptionClient();

async function connectToMongo(uri: string) {
  await mongoose
    .connect(uri)
    .then(() => console.log('1. mongo connected.'))
    .then(() =>
      Promise.all([
        mongoose.connection.collection('users').deleteMany({}),
        mongoose.connection.collection('posts').deleteMany({}),
        mongoose.connection.collection('paymenents').deleteMany({}),
      ]),
    )
    .then(() => console.log('2. db has been cleared.'));
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

async function getUserData(): Promise<any> {
  try {
    const result = await prisma.user.findMany({
      where: {},
      include: {
        avatar: {
          select: {
            url: true,
            previewUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        profile: {
          select: {
            name: true,
            surname: true,
            birthday: true,
            city: true,
            aboutMe: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    await Promise.all([
      writeFile('users', result),
      ...result.map((user) => UserModel.create(user)),
    ]);
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

    await Promise.all([
      writeFile('posts', result),
      ...result.map((post) => PostModel.create(post)),
    ]);
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

    await mongoose.connection.collection('payments').deleteMany({});

    const payments = result.map(({ subscriptionPayment, ...rest }) => {
      const payment = {
        ...rest,
        endDate: subscriptionPayment?.subscription?.endDate,
        startDate: subscriptionPayment?.subscription?.startDate,
        type: subscriptionPayment?.subscription?.type,
        period: subscriptionPayment?.pricingPlan?.price?.period,
        periodType: subscriptionPayment?.pricingPlan?.price?.periodType,
      };

      return PaymentModel.create(payment);
    });

    await Promise.all([writeFile('subscriptions', result), ...payments]);
  } catch (error: any) {
    console.log(error);

    throw new Error(error.message);
  }
}

const uri = <string>process.env.MONGODB_URI;

connectToMongo(uri)
  .then(getUserData)
  .then(getPostsData)
  .then(getSubscriptionsData)
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await Promise.all([
      prisma.$disconnect(),
      prismaSubscription.$disconnect(),
      mongoose.connection.close(),
    ]);
    console.log('3. completed.');
  });
