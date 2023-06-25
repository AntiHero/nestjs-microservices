import { confirmedEmailMessageCreator }       from '@app/common/message-creators/confirmed-email.message-creator';
import { RootEvent }                          from '@app/common/patterns';
import { BadRequestException, GoneException } from '@nestjs/common';
import { CommandHandler, ICommandHandler }    from '@nestjs/cqrs';
import { EventEmitter2 as EventEmitter }      from '@nestjs/event-emitter';

import { NOTIFY_ADMIN_EVENT }                 from '../../common/event-router';
import { UserRepository }                     from '../../user/repositories/user.repository';
import { UserWithEmailConfirmation }          from '../../user/types';
import { ConfirmationCodeDto }                from '../dto/confirmation-code.dto';

export class ConfirmRegistrationCommand {
  constructor(public codeDto: ConfirmationCodeDto) {}
}
@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationUseCase
  implements ICommandHandler<ConfirmRegistrationCommand>
{
  public constructor(
    private readonly userRepository: UserRepository,
    public readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(command: ConfirmRegistrationCommand) {
    const user = await this.userRepository.findUserByEmailConfirmationCode(
      command.codeDto.code,
    );

    if (!user)
      throw new BadRequestException(
        'No user exists with the given confirmation code',
      );

    this.checkUserConfirmationCode(user, command.codeDto.code);

    await this.userRepository.confirmRegistration(user.email);

    this.eventEmitter.emit(NOTIFY_ADMIN_EVENT, {
      event: RootEvent.ConfirmedEmail,
      message: confirmedEmailMessageCreator({
        isEmailConfirmed: true,
        userId: user.id,
      }),
    });
  }

  public checkUserConfirmationCode(
    user: UserWithEmailConfirmation,
    code: string,
  ) {
    if (!user.emailConfirmation)
      throw new BadRequestException(
        'No email confirmation exists for the current user',
      );

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException('User email already confirmed');
    }

    if (user.emailConfirmation.confirmationCode !== code) {
      throw new BadRequestException('User code does not match');
    }

    if (user.emailConfirmation.expirationDate < new Date().toISOString()) {
      throw new GoneException('User code has expired');
    }

    return true;
  }
}
