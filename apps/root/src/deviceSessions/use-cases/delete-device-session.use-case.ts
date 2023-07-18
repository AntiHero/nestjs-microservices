import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler }       from '@nestjs/cqrs';

import { JwtAdapter }                            from '../../adapters/jwt/jwt.adapter';
import { ActiveUserData }                        from '../../user/types';
import { DeviceSessionsRepository }              from '../repositories/device-sessions.repository';

export class DeleteDeviceSessionCommand {
  constructor(public user: ActiveUserData, public deviceId: string) {}
}
@CommandHandler(DeleteDeviceSessionCommand)
export class DeleteDeviceSessionUseCase
  implements ICommandHandler<DeleteDeviceSessionCommand>
{
  constructor(
    private readonly jwtAdaptor: JwtAdapter,
    private readonly deviceSessionsRepository: DeviceSessionsRepository,
  ) {}
  async execute(command: DeleteDeviceSessionCommand) {
    const isSession = await this.deviceSessionsRepository.findSessionByDeviceId(
      command.deviceId,
    );
    if (!isSession) throw new NotFoundException('Device is not found');

    if (isSession.userId !== command.user.userId)
      throw new ForbiddenException();

    await this.deviceSessionsRepository.deleteSessionByDeviceId(
      command.deviceId,
    );
  }
}
