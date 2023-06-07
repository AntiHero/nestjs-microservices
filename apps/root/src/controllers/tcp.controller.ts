import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';

import { ROOT_PATTERNS } from '@app/common/patterns/root.patterns';
import { UserRepository } from '../user/repositories/user.repository';
import { GetUserInfoResult } from '@app/common/interfaces/get-user-info-result.interface';

@Controller()
export class TcpController {
  public constructor(private readonly userRepository: UserRepository) {}

  @MessagePattern(ROOT_PATTERNS.GET_USER_INFO())
  public async getUserInfo({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserInfoResult | null> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) return null;

    return { username: user.username, email: user.email };
  }
}
