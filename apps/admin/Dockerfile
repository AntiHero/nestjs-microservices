FROM node:18-alpine as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY apps/admin/package.json ./apps/admin/package.json

RUN yarn 

COPY . .

RUN yarn prisma generate --schema=prisma/root/schema.prisma
RUN yarn prisma generate --schema=prisma/subscriptions/schema.prisma

RUN yarn build admin 

FROM node:alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules  ./node_modules
COPY --from=builder /usr/src/app/dist/apps/admin ./admin

CMD sh -c "node ./admin/main" 