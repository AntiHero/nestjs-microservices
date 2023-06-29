import { randomUUID } from 'crypto';

import { ServiceUnavailableException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { MailService } from 'apps/root/src/mail/mail.service';
import { UserRepository } from 'apps/root/src/user/repositories/user.repository';

export class PasswordRecoveryCommand {
  public constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUserUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  public constructor(
    private readonly usersRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  public async execute(command: PasswordRecoveryCommand) {
    const { email } = command;

    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) return;

    const recoveryCode = randomUUID();

    try {
      await Promise.all([
        this.mailService.sendPasswordRecoveryEmail(user, recoveryCode),
        this.usersRepository.updatePasswordRecoveryCode(user.id, recoveryCode),
      ]);
    } catch (error) {
      console.log(error);

      throw new ServiceUnavailableException(
        'Could not proceed recovery password',
      );
    }
  }
}
