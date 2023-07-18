import { randomUUID } from 'crypto';

import { createdUserMessageCreator } from '@app/common/message-creators/created-user.message-creator';
import { RootEvent } from '@app/common/patterns';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { User } from '@prisma/client';
import { add } from 'date-fns';
import Joi from 'joi';

import { OauthProvider } from 'apps/root/src/common/constants';
import { MailService } from 'apps/root/src/mail/mail.service';
import {
  AvatarPayload,
  CreateUserWithOauthAccountData,
} from 'apps/root/src/user/types';

import { JwtAdapter } from '../../adapters/jwt/jwt.adapter';
import { NOTIFY_ADMIN_EVENT } from '../../common/event-router';
import { UserRepository } from '../../user/repositories/user.repository';
import { DevicesSessionsService } from '../services/devices.service';
import { GithubUsersService } from '../services/github-users.service';
import type { OauthCommandData } from '../types';

export class SignUpWithGithubCommand {
  public constructor(public readonly data: OauthCommandData) {
    const schema = Joi.object({
      code: Joi.string().required(),
    });

    const { error } = schema.validate({ code: this.data.code });

    if (error) {
      throw new BadRequestException(error);
    }
  }
}

@CommandHandler(SignUpWithGithubCommand)
export class SignUpUserWithGithubUseCase
  implements ICommandHandler<SignUpWithGithubCommand>
{
  public constructor(
    private readonly devicesSessionsService: DevicesSessionsService,
    private readonly githubUserService: GithubUsersService,
    private readonly userRepository: UserRepository,
    private readonly emailService: MailService,
    private readonly jwtAdaptor: JwtAdapter,
    private readonly eventEmitter: EventEmitter,
  ) {}

  private readonly type = OauthProvider.GITHUB;

  public async execute(command: SignUpWithGithubCommand) {
    try {
      const { code, ip, userAgent } = command.data;

      const githubUserData = await this.githubUserService.getGithubUserData(
        code,
      );

      const { email } = githubUserData;

      let user: Pick<User, 'username' | 'id' | 'email' | 'createdAt'> | null =
        await this.userRepository.findUserByEmail(email);

      const { id: clientId } = githubUserData;

      if (!user) {
        const { username, avatarUrl, firstName, lastName } = githubUserData;

        const isUsernameInUse = await this.userRepository.findUserByUserName(
          username,
        );

        let uniqueUsername = username;

        if (isUsernameInUse) {
          uniqueUsername = await this.userRepository.createUniqueUsername(
            username,
          );
        }

        let avatarPayload: AvatarPayload | null = null;

        if (avatarUrl) {
          const avatarMetdata =
            await this.githubUserService.getGithubUserAvatarMetadata(avatarUrl);

          avatarPayload = {
            url: avatarUrl,
            previewUrl: avatarUrl,
            ...avatarMetdata,
          };
        }

        const createUserData: CreateUserWithOauthAccountData = {
          email,
          clientId,
          name: firstName,
          surname: lastName,
          username: uniqueUsername,
          type: this.type,
        };

        if (avatarPayload) {
          createUserData.avatarPayload = avatarPayload;
        }

        user = await this.userRepository.createUserWithOauthAccount(
          createUserData,
        );

        const { id, createdAt } = user;

        const message = createdUserMessageCreator({
          id,
          username: uniqueUsername,
          email,
          createdAt,
        });

        this.eventEmitter.emit(NOTIFY_ADMIN_EVENT, [
          RootEvent.CreatedUser,
          message,
        ]);

        await this.emailService.sendOauthAccountCreationEmail(user);
      } else {
        const existingOauthAccount =
          await this.userRepository.findOauthAccountByQuery({
            clientId,
            type: this.type,
          });

        if (!existingOauthAccount || !existingOauthAccount.linked) {
          const mergeCode = randomUUID();

          await this.userRepository.updateOrCreateOauthAccount({
            userId: user.id,
            mergeCode,
            clientId,
            type: this.type,
            mergeCodeExpDate: add(new Date(), { minutes: 10 }),
          });

          await this.emailService.sendMergeAccountEmail(user, mergeCode);

          return email;
        }
      }

      const deviceId = command.data.deviceId || randomUUID();

      const { id: userId, username } = user;

      const tokens = await this.jwtAdaptor.getTokens(
        userId,
        username,
        deviceId,
      );

      const { accessTokenHash, refreshTokenHash } =
        await this.jwtAdaptor.updateTokensHash(tokens);

      await this.devicesSessionsService.manageDeviceSession(deviceId, {
        ip,
        deviceName: userAgent,
        accessTokenHash,
        refreshTokenHash,
        userId,
      });

      return tokens;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException();
    }
  }
}
