import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Ip,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CookieOptions, Response } from 'express';

import { RecaptchaGuard } from 'apps/root/src/common/guards/recaptcha.guard';
import { githubOauthConfig } from 'apps/root/src/config/github-oauth.config';

import { JwtAdapter } from '../../adapters/jwt/jwt.adapter';
import { ActiveUser } from '../../common/decorators/active-user.decorator';
import {
  AuthGoogleDecorator,
  AuthLoginSwaggerDecorator,
  AuthLogoutSwaggerDecorator,
  AuthNewPasswordSwaggerDecorator,
  AuthPasswordRecoverySwaggerDecorator,
  AuthRefreshTokenSwaggerDecorator,
  AuthRegistrationConfirmationSwaggerDecorator,
  AuthRegistrationEmailResendingSwaggerDecorator,
  AuthRegistrationSwaggerDecorator,
  AuthWithGithubDecorator,
  MergeAccountsDecorator,
} from '../../common/decorators/swagger/auth.decorator';
import { CookieAuthGuard } from '../../common/guards/cookie-auth.guard';
import { RefreshTokenJwtGuard } from '../../common/guards/jwt-auth.guard';
import { ActiveUserData } from '../../user/types';
import { AuthDto } from '../dto/auth.dto';
import { ConfirmationCodeDto } from '../dto/confirmation-code.dto';
import { EmailDto } from '../dto/email.dto';
import { GithubCodeDto } from '../dto/github-code.dto';
import { GoogleCodeDto } from '../dto/google-code.dto';
import { LoginDto } from '../dto/login.dto';
import { NewPasswordDto } from '../dto/new-password.dto';
import { TokensPair } from '../types';
import { ConfirmRegistrationCommand } from '../use-cases/confirm-registration-use-case';
import { LoginUserCommand } from '../use-cases/login-user-use-case';
import { LogoutUserCommand } from '../use-cases/logout-user-use-case';
import { MergeAccountCommand } from '../use-cases/merge-account.use-case';
import { NewPasswordCommand } from '../use-cases/new-password.use-case';
import { PasswordRecoveryCommand } from '../use-cases/password-recovery.use-case';
import { RegisterUserCommand } from '../use-cases/register-user-use-case';
import { RegistrationEmailResendingCommand } from '../use-cases/registration-email-resending-use-case';
import { SignUpWithGithubCommand } from '../use-cases/sign-up-user-with-github.use-case';
import { SignUpUserWithGoogleCommand } from '../use-cases/sign-up-user-with-google.use-case';

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
  private cookieOptions: Partial<CookieOptions> = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  };

  public constructor(
    private commandBus: CommandBus,
    private readonly jwtAdaptor: JwtAdapter,
    @Inject(githubOauthConfig.KEY)
    private readonly githubConfig: ConfigType<typeof githubOauthConfig>,
  ) {}

  @Post('registration')
  @AuthRegistrationSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async registration(@Body() authDto: AuthDto) {
    return this.commandBus.execute(new RegisterUserCommand(authDto));
  }

  @Post('registration-confirmation')
  @AuthRegistrationConfirmationSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async registrationConfirmation(
    @Body() confirmationCodeDto: ConfirmationCodeDto,
  ) {
    return this.commandBus.execute(
      new ConfirmRegistrationCommand(confirmationCodeDto),
    );
  }

  @Post('registration-email-resending')
  @AuthRegistrationEmailResendingSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async registrationEmailResending(@Body() emailDto: EmailDto) {
    return this.commandBus.execute(
      new RegistrationEmailResendingCommand(emailDto),
    );
  }

  @Post('login')
  @AuthLoginSwaggerDecorator()
  @UseGuards(CookieAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent: string,
    @ActiveUser('deviceId') deviceId: string | null,
  ) {
    if (!userAgent) throw new UnauthorizedException();

    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginUserCommand,
      { accessToken: string; refreshToken: string }
    >(new LoginUserCommand(loginDto, ip, userAgent, deviceId));

    res.cookie('refreshToken', refreshToken, this.cookieOptions);

    return { accessToken };
  }

  @UseGuards(CookieAuthGuard)
  @AuthGoogleDecorator()
  @HttpCode(HttpStatus.OK)
  @Post('google/sign-in')
  public async googleSignIn(
    @Ip() ip: string,
    @Body() googleCodeDto: GoogleCodeDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent: string,
    @ActiveUser('deviceId') deviceId: string | null,
  ) {
    const { code } = googleCodeDto;

    const result = await this.commandBus.execute<
      SignUpUserWithGoogleCommand,
      TokensPair | string
    >(new SignUpUserWithGoogleCommand({ code, deviceId, userAgent, ip }));

    if (typeof result === 'string') {
      res.status(HttpStatus.ACCEPTED).send({ email: result });
      return;
    }

    const { accessToken, refreshToken } = result;

    res.cookie('refreshToken', refreshToken, this.cookieOptions);

    return { accessToken };
  }

  @UseGuards(RefreshTokenJwtGuard)
  @Post('logout')
  @AuthLogoutSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(
    @ActiveUser('deviceId') deviceId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.commandBus.execute(new LogoutUserCommand(deviceId));

    res.clearCookie('refreshToken', this.cookieOptions);
  }

  @UseGuards(RefreshTokenJwtGuard)
  @Post('refresh-token')
  @AuthRefreshTokenSwaggerDecorator()
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @ActiveUser() user: ActiveUserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.jwtAdaptor.refreshToken(
      user,
    );

    res.cookie('refreshToken', refreshToken, this.cookieOptions);

    return { accessToken };
  }

  @Post('password-recovery')
  @AuthPasswordRecoverySwaggerDecorator()
  @UseGuards(RecaptchaGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async passwordRecovery(@Body() emailDto: EmailDto) {
    const { email } = emailDto;

    return this.commandBus.execute(new PasswordRecoveryCommand(email));
  }

  @Post('new-password')
  @AuthNewPasswordSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async newPassword(
    @Body() newPasswordDto: NewPasswordDto,
    @Res() res: Response,
  ) {
    const { newPassword, recoveryCode } = newPasswordDto;

    await this.commandBus.execute(
      new NewPasswordCommand(newPassword, recoveryCode),
    );

    res.clearCookie('refreshToken', this.cookieOptions);
  }

  @Post('github/sign-in')
  @AuthWithGithubDecorator()
  @UseGuards(CookieAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async gihtubSignIn(
    @Ip() ip: string,
    @Body() githubCodeDto: GithubCodeDto,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) response: Response,
    @ActiveUser('deviceId') deviceId: string | null,
  ) {
    const { code } = githubCodeDto;

    const result = await this.commandBus.execute<
      SignUpWithGithubCommand,
      TokensPair | string
    >(new SignUpWithGithubCommand({ code, deviceId, ip, userAgent }));

    if (typeof result === 'string') {
      response.status(HttpStatus.ACCEPTED).send({ email: result });
      return;
    }

    const { accessToken, refreshToken } = result;

    response.cookie('refreshToken', refreshToken, this.cookieOptions);

    response.status(HttpStatus.OK).json({ accessToken });
  }

  @Post('merge-account')
  @MergeAccountsDecorator()
  @UseGuards(CookieAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async mergeAccounts(
    @Query('code') mergeCode: string,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @ActiveUser('deviceId') deviceId: string | null,
  ) {
    return this.commandBus.execute(
      new MergeAccountCommand({ mergeCode, ip, userAgent, deviceId }),
    );
  }
}
