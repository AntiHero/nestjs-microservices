import { Module }            from '@nestjs/common';
import { ConfigService }     from '@nestjs/config';
import { MailerModule }      from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MailService }       from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: config.get('GMAIL_EMAIL'),
            pass: config.get('GMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('GMAIL_EMAIL')}>`,
        },
        template: {
          dir: 'apps/root/src/mail/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
