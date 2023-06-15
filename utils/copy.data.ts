import { Prisma, PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import { resolve } from 'node:path';

const prisma = new PrismaClient();

async function getTables(): Promise<Table[]> {
  try {
    const result = await prisma.$queryRaw(Prisma.sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE';
  `);

    console.log(result);
    return result as Table[];
  } catch (error: any) {
    console.log(error);

    throw new Error(error.message);
  }
}

interface Table {
  table_name: string;
}

async function copyData(tables: Table[]) {}

async function getUserData(): Promise<any> {
  try {
    const result = await prisma.user.findMany({
      where: {},
      include: {
        emailConfirmation: true,
        avatar: true,
        oauthAccount: true,
        profile: true,
        passwordRecovery: true,
      },
    });

    await new Promise<void>((res, rej) =>
      fs.writeFile(
        resolve(__dirname, 'user.json'),
        JSON.stringify(result),
        { flag: 'w' },
        (err) => {
          if (err) rej(err);

          res();
        },
      ),
    );
  } catch (error: any) {
    console.log(error);

    throw new Error(error.message);
  }
}

async function getPostsData(): Promise<any> {
  try {
    const result = await prisma.post.findMany({
      where: {},
      include: {
        images: {
          include: {
            metadata: true,
          },
        },
      },
    });

    await new Promise<void>((res, rej) =>
      fs.writeFile(
        resolve(__dirname, 'posts.json'),
        JSON.stringify(result),
        { flag: 'w' },
        (err) => {
          if (err) rej(err);

          res();
        },
      ),
    );
  } catch (error: any) {
    console.log(error);

    throw new Error(error.message);
  }
}

getUserData()
  .then(getPostsData)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(() => console.log('completed'));
