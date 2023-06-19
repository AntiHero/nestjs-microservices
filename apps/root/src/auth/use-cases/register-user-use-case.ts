import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AuthDto } from '../dto/auth.dto';
import { MailService } from '../../mail/mail.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { BcryptAdaptor } from '../../adaptors/bcrypt/bcrypt.adaptor';
import { createdUserMessageCreator } from '@app/common/message-creators/created-user.message-creator';
import { RootEvents } from '@app/common/patterns/root.patterns';
import { NOTIFY_ADMIN_EVENT } from '../../common/services/event-handler.service';

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
    private readonly bcryptAdaptor: BcryptAdaptor,
    private readonly eventEmitter: EventEmitter,
  ) {}
  async execute(command: RegisterUserCommand) {
    const { email, password, username } = command.authDto;
    // check that user with the given email or userName does not exist
    const checkUserEmail = await this.userRepository.findUserByEmail(email);
    if (checkUserEmail)
      throw new BadRequestException('This email already exists');
    const checkUserByUserName = await this.userRepository.findUserByUserName(
      username,
    );
    if (checkUserByUserName)
      throw new BadRequestException('This userName already exists');
    // generate salt and hash
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
        RootEvents.CreatedUser,
        message,
      ]);

      // send email
      return this.mailService.sendUserConfirmation(
        newUser,
        newUser.emailConfirmation.confirmationCode,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
