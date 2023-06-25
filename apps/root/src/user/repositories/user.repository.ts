import { randomUUID }                            from 'crypto';

import { DatabaseException }                     from '@app/common/exceptions/database.exception';
import { Injectable }                            from '@nestjs/common';
import { EmailConfirmation, OauthAccount, User } from '@prisma/client';
import { add }                                   from 'date-fns';

import { UpdateOrCreateOauthAccountPaylod }      from 'apps/root/src/auth/types';

import { PrismaService }                         from '../../prisma/prisma.service';
import { CreateUserDto }                         from '../dto/create.user.dto';
import {
  CreateUserWithOauthAccountData,
  UserWithEmailConfirmation,
} from '../types';

@Injectable()
export class UserRepository {
  public constructor(private prisma: PrismaService) {}

  public async createUser(createUserDto: CreateUserDto, hash: string) {
    const { username, email } = createUserDto;

    return this.prisma.user.create({
      data: {
        username,
        email,
        hash,
        emailConfirmation: {
          create: {
            confirmationCode: randomUUID(),
            expirationDate: add(new Date(), {
              minutes: 5,
            }).toISOString(),
            isConfirmed: false,
          },
        },
        passwordRecovery: { create: {} },
        profile: { create: {} },
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        emailConfirmation: {
          select: {
            confirmationCode: true,
          },
        },
      },
    });
  }

  public async createUserWithOauthAccount(
    createUserData: CreateUserWithOauthAccountData,
  ) {
    const { username, email, avatarPayload, clientId, type } = createUserData;

    const { url, previewUrl, size, height, width } = avatarPayload || {};

    return this.prisma.user.create({
      data: {
        username,
        email,
        hash: null,
        emailConfirmation: {
          create: {
            confirmationCode: '',
            expirationDate: new Date().toISOString(),
            isConfirmed: true,
          },
        },
        passwordRecovery: { create: {} },
        profile: { create: {} },
        avatar: {
          create: avatarPayload ? { url, previewUrl, size, height, width } : {},
        },
        oauthAccount: {
          create: {
            clientId,
            type,
            linked: true,
            mergeCode: randomUUID(),
            mergeCodeExpDate: add(new Date(), { minutes: 10 }),
          },
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        oauthAccount: {
          select: {
            mergeCode: true,
          },
        },
      },
    });
  }

  public async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email },
      include: {
        emailConfirmation: {
          select: { isConfirmed: true },
        },
      },
    });
  }

  public async findUserByUserName(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        emailConfirmation: {
          select: { isConfirmed: true },
        },
      },
    });
  }

  public async findUserByEmailConfirmationCode(
    code: string,
  ): Promise<UserWithEmailConfirmation | null> {
    return this.prisma.user.findFirst({
      where: {
        emailConfirmation: {
          confirmationCode: code,
        },
      },
      include: {
        emailConfirmation: {
          select: {
            confirmationCode: true,
            expirationDate: true,
            isConfirmed: true,
          },
        },
      },
    });
  }

  public async findUserByConfirmationOrRecoveryCode(code: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            emailConfirmation: {
              confirmationCode: code,
            },
          },
          {
            passwordRecovery: {
              recoveryCode: code,
            },
          },
        ],
      },
      include: {
        emailConfirmation: {
          select: {
            confirmationCode: true,
            expirationDate: true,
            isConfirmed: true,
          },
        },
        passwordRecovery: {
          select: {
            recoveryCode: true,
            expirationDate: true,
          },
        },
      },
    });
  }

  public async confirmRegistration(
    userEmail: string,
  ): Promise<EmailConfirmation> {
    return this.prisma.emailConfirmation.update({
      where: { userEmail },
      data: { isConfirmed: true },
    });
  }

  public async updateEmailConfirmationInfo(
    userEmail: string,
  ): Promise<EmailConfirmation> {
    return this.prisma.emailConfirmation.update({
      where: { userEmail },
      data: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          minutes: 10,
        }).toISOString(),
      },
    });
  }

  public async updatePasswordRecoveryCode(
    userId: string,
    recoveryCode: string,
  ) {
    return this.prisma.passwordRecovery.update({
      where: { userId },
      data: {
        recoveryCode,
        expirationDate: add(new Date(), {
          minutes: 10,
        }).toISOString(),
      },
    });
  }

  public async updatePassword(id: string, hash: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        hash,
        passwordRecovery: {
          update: {
            recoveryCode: null,
            expirationDate: null,
          },
        },
      },
    });
  }

  public async findUserById(
    id: string,
  ): Promise<UserWithEmailConfirmation | null> {
    try {
      const result = this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          emailConfirmation: true,
        },
      });

      return result;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async deleteAll() {
    return this.prisma.user.deleteMany({});
  }

  public async updateOrCreateOauthAccount(
    payload: UpdateOrCreateOauthAccountPaylod,
  ) {
    const { clientId, type } = payload;

    try {
      return this.prisma.oauthAccount.upsert({
        where: {
          clientId_type: {
            clientId,
            type,
          },
        },
        update: { ...payload },
        create: payload,
      });
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async createUniqueUsername(username: string) {
    let uniqueUsername = username;
    let count = 1;

    while (await this.findUserByUserName(username)) {
      uniqueUsername = `${username}${count}`;
      count++;
    }

    return uniqueUsername;
  }

  public async findOauthAccountByQuery(
    query: Partial<
      Pick<OauthAccount, 'clientId' | 'id' | 'userId' | 'type' | 'mergeCode'>
    >,
  ) {
    try {
      return this.prisma.oauthAccount.findFirst({
        where: query,
      });
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async update(id: string, updates: Partial<User>) {
    try {
      const result = await this.prisma.user.update({
        where: {
          id,
        },
        data: updates,
      });

      return !!result;
    } catch (error) {
      console.log(error);

      throw new DatabaseException();
    }
  }

  public async delete(id: string) {
    try {
      const result = await this.prisma.user.delete({
        where: {
          id,
        },
      });

      return result.id ? true : false;
    } catch (error) {
      console.log(error);
    }
  }
}
