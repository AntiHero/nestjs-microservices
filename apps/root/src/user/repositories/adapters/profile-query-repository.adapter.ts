import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ProfileDbModel } from 'apps/root/src/user/types';

@Injectable()
export abstract class ProfileQueryRepositoryAdapter {
  abstract findProfileAndAvatarByQuery(
    payload: Partial<Pick<User, 'id' | 'username' | 'email'>>,
  ): Promise<ProfileDbModel | null>;
}
