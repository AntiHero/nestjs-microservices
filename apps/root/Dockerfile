FROM node:18-alpine 

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma/root/ ./prisma/root/
COPY prisma/subscriptions/ ./prisma/subscriptions/

RUN yarn install

COPY . .

RUN yarn prisma generate --schema=prisma/root/schema.prisma
RUN yarn prisma generate --schema=prisma/subscriptions/schema.prisma

RUN yarn build root

EXPOSE 5001

CMD sh -c "yarn migrate:deploy:root && node ./dist/apps/root/main" 