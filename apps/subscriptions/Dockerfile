FROM node:alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma/subscriptions/ ./prisma/subscriptions/
COPY prisma/root/ ./prisma/root/

RUN yarn install
RUN yarn prisma generate --schema=prisma/subscriptions/schema.prisma
RUN yarn prisma generate --schema=prisma/root/schema.prisma

COPY . .

RUN yarn build subscriptions 

EXPOSE 5001

CMD sh -c "yarn migrate:deploy:subscriptions && node ./dist/apps/subscriptions/main" 
# CMD ["node", "dist/apps/subscriptions/main"]
# FROM node:18

# WORKDIR /usr/src/app

# COPY package.json yarn.lock ./
# COPY prisma ./prisma/

# RUN yarn install

# COPY . .

# RUN yarn build

# CMD ["node", "dist/apps/subscriptions/main"]