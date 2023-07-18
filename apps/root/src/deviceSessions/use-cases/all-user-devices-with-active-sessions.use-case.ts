import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { JwtAdapter }                      from '../../adapters/jwt/jwt.adapter';
import { ActiveUserData }                  from '../../user/types';
import { DeviceSessionsRepository }        from '../repositories/device-sessions.repository';
import { DeviceViewModel }                 from '../types';

export class AllUserDevicesWithActiveSessionsCommand {
  constructor(public user: ActiveUserData) {}
}

@CommandHandler(AllUserDevicesWithActiveSessionsCommand)
export class AllUserDevicesWithActiveSessionsUseCase
  implements ICommandHandler<AllUserDevicesWithActiveSessionsCommand>
{
  public constructor(
    private readonly jwtAdaptor: JwtAdapter,
    private readonly deviceSessionsRepository: DeviceSessionsRepository,
  ) {}

  public async execute(
    command: AllUserDevicesWithActiveSessionsCommand,
  ): Promise<DeviceViewModel[] | null> {
    return this.deviceSessionsRepository.findAllActiveSessions(
      command.user.userId,
      command.user.deviceId,
    );
  }
}
