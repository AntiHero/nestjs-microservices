import { type AvatarViewModel } from './common.interfaces';
import { UserClass }            from '../app/entity/user.model';

export interface UserInfoViewModel {
  id: string;
  username: string;
  profileLink: string;
  dateAdded: string;
  avatar: AvatarViewModel;
  isBanned: boolean;
  banReason: string;
}

export const toUserInfoViewModel = (input: UserClass): UserInfoViewModel => ({
  id: input.id,
  username: input.username,
  profileLink: `${process.env.FRONTEND_DOMAIN}/users/${input.username}`,
  dateAdded: input.createdAt as unknown as string,
  avatar: {
    url: input.avatar?.url || null,
    previewUrl: input.avatar?.previewUrl || null,
  },
  isBanned: input.isBanned || false,
  banReason: input.banReason || '',
});
