import { Queue } from '@app/common/queues';
import { RmqService } from '@app/common/src';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { useGlobalFilters } from './common/filters/global.filter';
import { useGlobalPipes } from './common/pipes/global.pipe';
import { setupSwagger } from './config/swagger.config';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      process.env.FRONTEND_LOCAL_DOMAIN as string,
      process.env.FRONTEND_DOMAIN as string,
    ],
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
      'Authorization',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
  });
  app.use(cookieParser());
  app.use(compression());

  setupSwagger(app);
  useGlobalPipes(app);
  useGlobalFilters(app);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get<string>('global.root.tcpPort'),
    },
  });

  const rmqService = app.get<RmqService>(RmqService);
  // find connection options by queue name
  app.connectMicroservice(rmqService.getOptions(Queue.Root));

  await Promise.all([
    app.startAllMicroservices(),
    app.listen(configService.get<string>('PORT') || 5000),
  ]).then(() => console.log(`Root Microservice is running...`));
}
bootstrap();
