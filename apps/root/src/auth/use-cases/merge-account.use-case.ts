import { randomUUID }                      from 'crypto';

import { UnauthorizedException }           from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User }                            from '@prisma/client';

import { JwtAdapter }                      from 'apps/root/src/adapters/jwt/jwt.adapter';
import { UserRepository }                  from 'apps/root/src/user/repositories/user.repository';

import { DevicesSessionsService }          from '../services/devices.service';

export class MergeAccountCommand {
  constructor(
    public readonly data: {
      ip: string;
      mergeCode: string;
      userAgent: string;
      deviceId: string | null;
    },
  ) {}
}
@CommandHandler(MergeAccountCommand)
export class MergeAccountsUseCase
  implements ICommandHandler<MergeAccountCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly devicesSessionsService: DevicesSessionsService,
    private readonly jwtAdaptor: JwtAdapter,
  ) {}
  async execute(command: MergeAccountCommand) {
    try {
      const { mergeCode, ip, userAgent } = command.data;

      const oauthAccount = await this.userRepository.findOauthAccountByQuery({
        mergeCode,
      });

      if (!oauthAccount) throw new UnauthorizedException();

      if (
        oauthAccount.mergeCodeExpDate &&
        oauthAccount.mergeCodeExpDate < new Date()
      )
        throw new UnauthorizedException();

      const { clientId, userId, type } = oauthAccount;

      await this.userRepository.updateOrCreateOauthAccount({
        clientId,
        userId,
        type,
        mergeCode: null,
        mergeCodeExpDate: null,
        linked: true,
      });

      const deviceId = command.data.deviceId || randomUUID();

      const user = <User>await this.userRepository.findUserById(userId);

      const { username } = user;

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
