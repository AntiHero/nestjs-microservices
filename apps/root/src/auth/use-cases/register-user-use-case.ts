import { createdUserMessageCreator } from '@app/common/message-creators/created-user.message-creator';
import { RootEvent } from '@app/common/patterns/root.pattern';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';

import { BcryptAdapter } from '../../adapters/bcrypt/bcrypt.adapter';
import { NOTIFY_ADMIN_EVENT } from '../../common/event-router';
import { MailService } from '../../mail/mail.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { AuthDto } from '../dto/auth.dto';

export class RegisterUserCommand {
  constructor(public authDto: AuthDto) {}
}
@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly bcryptAdaptor: BcryptAdapter,
    private readonly eventEmitter: EventEmitter,
  ) {}
  async execute(command: RegisterUserCommand) {
    const { email, password, username } = command.authDto;
    const checkUserEmail = await this.userRepository.findUserByEmail(email);

    if (checkUserEmail)
      throw new BadRequestException('This email already exists');

    const checkUserByUserName = await this.userRepository.findUserByUserName(
      username,
    );

    if (checkUserByUserName)
      throw new BadRequestException('This userName already exists');

    const hash = await this.bcryptAdaptor.generateSaltAndHash(password);

    const newUser = await this.userRepository.createUser(command.authDto, hash);

    if (!newUser.emailConfirmation?.confirmationCode)
      throw new NotFoundException('confirmation code does not exist');

    try {
      const { id, createdAt } = newUser;

      const message = createdUserMessageCreator({
        id,
        username,
        email,
        createdAt,
      });

      this.eventEmitter.emit(NOTIFY_ADMIN_EVENT, [
        RootEvent.CreatedUser,
        message,
      ]);

      return this.mailService.sendUserConfirmationEmail(
        newUser,
        newUser.emailConfirmation.confirmationCode,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
