import { updatedProfileMessageCreator } from '@app/common/message-creators/updated-profile.message-creator';
import { RootEvent } from '@app/common/patterns/root.pattern';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { Profile } from '@prisma/client';

import { NOTIFY_ADMIN_EVENT } from '../../common/event-router';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import { ProfileQueryRepositoryAdapter } from '../repositories/adapters/profile-query-repository.adapter';
import { ProfileRepositoryAdapter } from '../repositories/adapters/profile-repository.adapter';
import { UserRepository } from '../repositories/user.repository';

export class UpdateProfileCommand {
  constructor(
    public userId: string,
    public updateUserProfileDto: UpdateUserProfileDto,
  ) {}
}
@CommandHandler(UpdateProfileCommand)
export class UpdateProfileUseCase
  implements ICommandHandler<UpdateProfileCommand>
{
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepositoryAdapter<Profile>,
    private readonly profileQueryRepository: ProfileQueryRepositoryAdapter,
    private readonly eventEmitter: EventEmitter,
  ) {}
  public async execute(command: UpdateProfileCommand) {
    const { userId } = command;

    const user = await this.userRepository.findUserById(userId);

    if (!user) throw new NotFoundException();

    if (command.updateUserProfileDto.username) {
      const checkUserName = await this.userRepository.findUserByUserName(
        command.updateUserProfileDto.username,
      );

      if (checkUserName && checkUserName.username !== user.username)
        throw new BadRequestException('This username is already used');
    }

    const profile =
      await this.profileQueryRepository.findProfileAndAvatarByQuery({
        id: userId,
      });

    if (!profile) throw new NotFoundException();

    await this.profileRepository.updateProfile(
      userId,
      command.updateUserProfileDto,
    );

    const updatedProfile =
      await this.profileQueryRepository.findProfileAndAvatarByQuery({
        id: userId,
      });

    const message = updatedProfileMessageCreator({
      ...updatedProfile?.profile,
      userId,
    });

    this.eventEmitter.emit(NOTIFY_ADMIN_EVENT, [
      RootEvent.UpdatedProfile,
      message,
    ]);
  }
}
