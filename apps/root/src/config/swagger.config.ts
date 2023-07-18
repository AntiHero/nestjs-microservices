import { INestApplication }               from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwaggerModule(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('INCTAGRAM')
    .setDescription('API documentation for INCTAGRAM App')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      bearerFormat: 'jwt',
    })
    .addCookieAuth('refresh-token')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
