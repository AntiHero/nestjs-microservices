import { HttpStatus, applyDecorators }        from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthDto }                            from 'apps/root/src/auth/dto/auth.dto';
import { GithubCodeDto }                      from 'apps/root/src/auth/dto/github-code.dto';

import { ConfirmationCodeDto }                from '../../../auth/dto/confirmation-code.dto';
import { EmailDto }                           from '../../../auth/dto/email.dto';
import { GoogleCodeDto }                      from '../../../auth/dto/google-code.dto';
import { LoginDto }                           from '../../../auth/dto/login.dto';
import { NewPasswordDto }                     from '../../../auth/dto/new-password.dto';
import { FieldError, LogginSuccessViewModel } from '../../../types';

export function AuthRegistrationSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'User registration' }),
    ApiBody({ type: AuthDto }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Registration successful. Confirmation code sent to email address.',
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data or email already registered',
      type: FieldError,
    }),
  );
}

export function AuthLoginSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'User login' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User login successful',
      type: LogginSuccessViewModel,
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data',
      type: FieldError,
    }),
    ApiUnauthorizedResponse({ description: 'Incorrect password or email' }),
  );
}

export function AuthLogoutSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'User logout' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Logout successful',
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid or missing refresh token',
    }),
    ApiCookieAuth(),
  );
}

export function AuthRegistrationConfirmationSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Confirm user registration' }),
    ApiBody({ type: ConfirmationCodeDto }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Email verification successful. Account activated',
    }),
    ApiBadRequestResponse({
      description: 'Incorrect or already used confirmation code',
      type: FieldError,
    }),
    ApiGoneResponse({
      description: 'Confirmation code expired',
      type: FieldError,
    }),
  );
}

export function AuthRegistrationEmailResendingSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Resend confirmation email' }),
    ApiBody({ type: EmailDto }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Email resent. Confirmation code sent to provided email address.',
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data',
      type: FieldError,
    }),
    ApiNotFoundResponse({ description: 'User with the given email not found' }),
  );
}

export function AuthRefreshTokenSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Generate new access and refresh tokens' }),
    ApiResponse({
      status: HttpStatus.OK,
      description:
        'New JWT accessToken (valid for 1 hour) returned in the response body. JWT refreshToken (valid for 2 hours) returned in the response cookie (http-only, secure).',
      type: LogginSuccessViewModel,
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid, expired, or missing refreshToken',
    }),
    ApiCookieAuth(),
  );
}

export function AuthPasswordRecoverySwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Recover password via Email confirmation',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['email', 'recaptchaToken'],
        properties: {
          email: {
            type: 'string',
            example: 'example@example.com',
          },
          recaptchaToken: {
            type: 'string',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Password recovery email sent (even if email is not registered)',
    }),
    ApiBadRequestResponse({
      description: 'Invalid email or missing recaptcha token',
    }),
    ApiForbiddenResponse({
      description: 'Invalid recaptcha token',
    }),
    ApiGoneResponse({
      description: 'Recovery code expired',
    }),
  );
}

export function AuthNewPasswordSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Confirm password recovery',
    }),
    ApiBody({ type: NewPasswordDto }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Password recovery successful',
    }),
    ApiBadRequestResponse({
      description: 'Invalid input or expired recovery code',
    }),
  );
}

export function AuthGoogleDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Sign in with Google account' }),
    ApiBody({ type: GoogleCodeDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Sign in successful with Google credentials',
      type: LogginSuccessViewModel,
    }),
    ApiResponse({
      status: HttpStatus.ACCEPTED,
      description:
        'User already registered. Email sent with account merge suggestion',
      schema: {
        type: 'object',
        example: {
          email: 'example@example.com',
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Incorrect code' }),
  );
}

export function AuthWithGithubDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Sign in/Sign up with GitHub account' }),
    ApiBody({ type: GithubCodeDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Sign in/Sign up successful with GitHub credentials',
      type: LogginSuccessViewModel,
    }),
    ApiResponse({
      status: HttpStatus.ACCEPTED,
      description: 'Email sent regarding successful registration',
      schema: {
        type: 'object',
        example: {
          email: 'example@example.com',
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Incorrect code' }),
  );
}

export function MergeAccountsDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Merge existing accounts' }),
    ApiQuery({ name: 'code', type: 'string' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Account merge successful',
      type: LogginSuccessViewModel,
    }),
    ApiUnauthorizedResponse({ description: 'Incorrect code' }),
    ApiCookieAuth(),
  );
}
