FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma/subscriptions/ ./prisma/subscriptions/
COPY prisma/root/ ./prisma/root/
COPY apps/subscriptions/package.json ./apps/subscriptions/package.json

RUN yarn install
RUN yarn prisma generate --schema=prisma/subscriptions/schema.prisma
RUN yarn prisma generate --schema=prisma/root/schema.prisma

COPY . .

RUN yarn build subscriptions 

EXPOSE 6001

CMD sh -c "yarn migrate:deploy:subscriptions && node ./dist/apps/subscriptions/main" 