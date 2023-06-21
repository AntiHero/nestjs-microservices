import { randomUUID }                                 from 'crypto';

import { createdUserMessageCreator }                  from '@app/common/message-creators/created-user.message-creator';
import { RootEvent }                                  from '@app/common/patterns';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler }            from '@nestjs/cqrs';
import { EventEmitter2 as EventEmitter }              from '@nestjs/event-emitter';
import { User }                                       from '@prisma/client';
import { add }                                        from 'date-fns';
import Joi                                            from 'joi';

import { GoogleAuthAdaptor }                          from '../../adaptors/google/google-auth.adaptor';
import { JwtAdaptor }                                 from '../../adaptors/jwt/jwt.adaptor';
import { OauthProvider }                              from '../../common/constants';
import { NOTIFY_ADMIN_EVENT }                         from '../../common/event-router';
import { MailService }                                from '../../mail/mail.service';
import { UserRepository }                             from '../../user/repositories/user.repository';
import { CreateUserWithOauthAccountData }             from '../../user/types';
import { DevicesSessionsService }                     from '../services/devices.service';
import { OauthCommandData }                           from '../types';

export class SignUpUserWithGoogleCommand {
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
@CommandHandler(SignUpUserWithGoogleCommand)
export class SignUpUserWithGoogleUseCase
  implements ICommandHandler<SignUpUserWithGoogleCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtAdaptor: JwtAdaptor,
    private readonly googleAuthAdaptor: GoogleAuthAdaptor,
    private readonly emailService: MailService,
    private readonly devicesSessionsService: DevicesSessionsService,
    private readonly eventEmitter: EventEmitter,
  ) {}

  private readonly type = OauthProvider.GOOGLE;
  async execute(command: SignUpUserWithGoogleCommand) {
    try {
      const { code, ip, userAgent } = command.data;

      const { name, given_name, family_name, email, id } =
        await this.googleAuthAdaptor.validateUser(code);

      let user: Pick<User, 'username' | 'id' | 'email' | 'createdAt'> | null =
        await this.userRepository.findUserByEmail(email);

      if (!user) {
        const isUsernameInUse = await this.userRepository.findUserByUserName(
          name,
        );

        let uniqueUsername = name;

        if (isUsernameInUse) {
          uniqueUsername = await this.userRepository.createUniqueUsername(name);
        }

        const createUserData: CreateUserWithOauthAccountData = {
          email,
          clientId: id,
          name: given_name,
          surname: family_name,
          username: uniqueUsername,
          type: this.type,
        };

        user = await this.userRepository.createUserWithOauthAccount(
          createUserData,
        );

        const { id: userId, createdAt } = user;

        const message = createdUserMessageCreator({
          id: userId,
          username: uniqueUsername,
          email,
          createdAt,
        });

        this.eventEmitter.emit(NOTIFY_ADMIN_EVENT, [
          RootEvent.CreatedUser,
          message,
        ]);

        await this.emailService.sendOauthAccountCreationConfirmation(user);
      } else {
        const existingOauthAccount =
          await this.userRepository.findOauthAccountByQuery({
            clientId: id,
            type: this.type,
          });

        if (!existingOauthAccount || !existingOauthAccount.linked) {
          const mergeCode = randomUUID();

          await this.userRepository.updateOrCreateOauthAccount({
            userId: user.id,
            mergeCode,
            clientId: id,
            type: this.type,
            mergeCodeExpDate: add(new Date(), { minutes: 10 }),
          });

          await this.emailService.sendAccountsMerge(user, mergeCode);
          return user.email;
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
