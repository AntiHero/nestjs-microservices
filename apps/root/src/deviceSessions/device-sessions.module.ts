import { Module, forwardRef }                      from '@nestjs/common';
import { CqrsModule }                              from '@nestjs/cqrs';

import { DeviceSessionsController }                from './api/device-sessions.controller';
import { DeviceSessionsRepository }                from './repositories/device-sessions.repository';
import { AllUserDevicesWithActiveSessionsUseCase } from './use-cases/all-user-devices-with-active-sessions.use-case';
import { DeleteAllDeviceSessionsButActiveUseCase } from './use-cases/delete-all-device-sessions-but-active.use-case';
import { DeleteDeviceSessionUseCase }              from './use-cases/delete-device-session.use-case';
import { AdaptorModule }                           from '../adapters/adaptor.module';

const useCases = [
  AllUserDevicesWithActiveSessionsUseCase,
  DeleteAllDeviceSessionsButActiveUseCase,
  DeleteDeviceSessionUseCase,
];
@Module({
  imports: [CqrsModule, forwardRef(() => AdaptorModule)],
  controllers: [DeviceSessionsController],
  providers: [DeviceSessionsRepository, ...useCases],
  exports: [DeviceSessionsRepository, ...useCases],
})
export class DeviceSessionsModule {}
