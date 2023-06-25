import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { JwtAdapter }                      from '../../adapters/jwt/jwt.adapter';
import { ActiveUserData }                  from '../../user/types';
import { DeviceSessionsRepository }        from '../repositories/device-sessions.repository';

export class DeleteAllDeviceSessionsButActiveCommand {
  constructor(public user: ActiveUserData) {}
}
@CommandHandler(DeleteAllDeviceSessionsButActiveCommand)
export class DeleteAllDeviceSessionsButActiveUseCase
  implements ICommandHandler<DeleteAllDeviceSessionsButActiveCommand>
{
  constructor(
    private readonly jwtAdaptor: JwtAdapter,
    private readonly deviceSessionsRepository: DeviceSessionsRepository,
  ) {}
  async execute(command: DeleteAllDeviceSessionsButActiveCommand) {
    return this.deviceSessionsRepository.deleteAllSessionsExceptCurrent(
      command.user.userId,
      command.user.deviceId,
    );
  }
}
