import { Queue }              from '@app/common/queues';
import { RmqService }         from '@app/common/src';
import { INestApplication }   from '@nestjs/common';
import { ConfigService }      from '@nestjs/config';
import { NestFactory }        from '@nestjs/core';
import { Transport }          from '@nestjs/microservices';
import compression            from 'compression';
import cookieParser           from 'cookie-parser';

import { AppModule }          from './app.module';
import { useGlobalFilters }   from './common/filters/global.filter';
import { useGlobalPipes }     from './common/pipes/global.pipe';
import { setupSwaggerModule } from './config/swagger.config';
import { PrismaService }      from './prisma/prisma.service';

async function bootstrap() {
  const app = await createApp();

  configureCors(app);
  useMiddlewares(app);
  setupSwagger(app);
  setupGlobalPipesAndFilters(app);

  await enableShutdownHooks(app);

  connectTcpMicroservice(app);
  connectRmqMicroservice(app);

  await Promise.all([startMicroservices(app), listen(app)]);
}

async function createApp(): Promise<INestApplication> {
  return await NestFactory.create(AppModule);
}

function configureCors(app: INestApplication): void {
  const frontendDomains = [
    process.env.FRONTEND_LOCAL_DOMAIN as string,
    process.env.FRONTEND_DOMAIN as string,
  ];

  app.enableCors({
    origin: frontendDomains,
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
      'Authorization',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
  });
}

function useMiddlewares(app: INestApplication): void {
  app.use(cookieParser());
  app.use(compression());
}

function setupSwagger(app: INestApplication): void {
  setupSwaggerModule(app);
}

function setupGlobalPipesAndFilters(app: INestApplication): void {
  useGlobalPipes(app);
  useGlobalFilters(app);
}

async function enableShutdownHooks(app: INestApplication): Promise<void> {
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
}

function connectTcpMicroservice(app: INestApplication): void {
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get<string>('global.root.tcpPort'),
    },
  });
}

function connectRmqMicroservice(app: INestApplication): void {
  const rmqService = app.get<RmqService>(RmqService);
  const rmqOptions = rmqService.getOptions(Queue.Root);

  app.connectMicroservice(rmqOptions);
}

async function startMicroservices(app: INestApplication): Promise<void> {
  await app.startAllMicroservices();
}

async function listen(app: INestApplication): Promise<void> {
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT') || 5000;

  await app.listen(port);
  console.log('Root Microservice is running at port %s...', port);
}

bootstrap();
