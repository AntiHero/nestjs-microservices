import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler }       from '@nestjs/cqrs';
import { Profile }                               from '@prisma/client';

import { CreateUserProfileDto }                  from '../dto/create.user.profile.dto';
import { ProfileQueryRepositoryAdapter }         from '../repositories/adapters/profile-query-repository.adapter';
import { ProfileRepositoryAdapter }              from '../repositories/adapters/profile-repository.adapter';
import { UserRepository }                        from '../repositories/user.repository';


export class CreateProfileCommand {
  constructor(
    public userId: string,
    public createUserProfileDto: CreateUserProfileDto,
  ) {}
}
@CommandHandler(CreateProfileCommand)
export class CreateProfileUseCase
  implements ICommandHandler<CreateProfileCommand>
{
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepositoryAdapter<Profile>,
    private readonly profileQueryRepository: ProfileQueryRepositoryAdapter,
  ) {}
  public async execute(command: CreateProfileCommand) {
    const { userId } = command;

    const user = await this.userRepository.findUserById(userId);

    if (!user || !user.emailConfirmation?.isConfirmed)
      throw new NotFoundException();

    const profile =
      await this.profileQueryRepository.findProfileAndAvatarByQuery({
        id: userId,
      });

    if (profile) throw new ForbiddenException();

    await this.profileRepository.createProfile(
      userId,
      command.createUserProfileDto,
    );
  }
}
