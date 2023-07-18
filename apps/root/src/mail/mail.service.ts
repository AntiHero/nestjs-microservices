import { Injectable }    from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User }          from '@prisma/client';

@Injectable()
export class MailService {
  public constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmationEmail(user: Partial<User>, token: string) {
    const url = `${process.env.FRONTEND_DOMAIN}/registration/confirmation?code=${token}&email=${user.email}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to INCTAGRAM! Confirm your Email',
      template: 'confirmation',
      context: {
        name: 'stranger',
        url,
      },
    });
  }

  async sendPasswordRecoveryEmail(user: User, token: string) {
    const url = `${process.env.FRONTEND_DOMAIN}/recovery/new-password?code=${token}&email=${user.email}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to INCTAGRAM! Recover your password',
      template: 'recovery',
      context: {
        name: 'stranger',
        url,
      },
    });
  }

  public async sendMergeAccountEmail(
    user: Pick<User, 'email' | 'username'>,
    token: string,
  ) {
    const { email, username } = user;
    const mergeUrl = `${process.env.FRONTEND_DOMAIN}/login/merge-account?code=${token}`;
    const loginUrl = `${process.env.FRONTEND_DOMAIN}/inctagram-m9ju.vercel.app/login`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to INCTAGRAM! Want to merge your accounts?',
      template: 'merge',
      context: {
        name: username,
        loginUrl,
        mergeUrl,
      },
    });
  }
  public async sendOauthAccountCreationEmail(
    user: Pick<User, 'email' | 'username'>,
  ) {
    const { email, username } = user;

    await this.mailerService.sendMail({
      to: email,
      subject: 'You have been successfully signed up to INCTAGRAM!',
      template: 'oauth-sign-up',
      context: {
        name: username,
      },
    });
  }
}
