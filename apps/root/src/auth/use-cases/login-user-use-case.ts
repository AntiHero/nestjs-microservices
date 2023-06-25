import { randomUUID }                      from 'crypto';

import { UnauthorizedException }           from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt                         from 'bcrypt';

import { JwtAdapter }                      from '../../adapters/jwt/jwt.adapter';
import { DeviceSessionsRepository }        from '../../deviceSessions/repositories/device-sessions.repository';
import { UserRepository }                  from '../../user/repositories/user.repository';
import { LoginDto }                        from '../dto/login.dto';

export class LoginUserCommand {
  constructor(
    public loginDto: LoginDto,
    public ip: string,
    public userAgent: string,
    public deviceId: string | null,
  ) {}
}
@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  public constructor(
    private readonly deviceSessionsRepository: DeviceSessionsRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtAdaptor: JwtAdapter,
  ) {}

  public async execute(command: LoginUserCommand) {
    // find user and check if its banned
    const user = await this.userRepository.findUserByEmail(
      command.loginDto.email,
    );

    if (!user)
      throw new UnauthorizedException(
        'User with the given email does not exist',
      );
    if (!user?.emailConfirmation?.isConfirmed)
      throw new UnauthorizedException(
        'Please, confirm an email in order to enter in the system',
      );

    if (!user.hash) throw new UnauthorizedException();

    const checkPassword = await bcrypt.compare(
      command.loginDto.password,
      user.hash ?? '',
    );

    if (!checkPassword) throw new UnauthorizedException();

    // tokens
    const deviceId = randomUUID();
    const tokens = await this.jwtAdaptor.getTokens(
      user.id,
      user.username,
      command.deviceId ? command.deviceId : deviceId,
    );
    const hashedTokens = await this.jwtAdaptor.updateTokensHash(tokens);
    // update or create new session
    if (command.deviceId) {
      const isDeviceSession =
        await this.deviceSessionsRepository.findSessionByDeviceId(
          command.deviceId,
        );

      if (isDeviceSession && isDeviceSession.userId === user.id) {
        await this.deviceSessionsRepository.updateTokensByDeviceSessionId(
          command.deviceId,
          hashedTokens,
        );

        return tokens;
      }
    }

    // create device session
    await this.deviceSessionsRepository.createNewDeviceSession(
      deviceId,
      user.id,
      command.ip,
      command.userAgent,
      hashedTokens,
    );

    return tokens;
  }
}
