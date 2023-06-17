import { UserModel } from '../app/entity/user.model';
import { type AvatarViewModel } from './common.interfaces';

export interface UserInfoViewModel {
  userId: string;
  username: string;
  profileLink: string;
  dateAdded: string;
  avatar: AvatarViewModel;
}

export const toUserInfoViewModel = (input: UserModel): UserInfoViewModel => ({
  userId: input.id,
  username: input.username,
  profileLink: `${process.env.FRONTEND_DOMAIN}/users/${input.username}`,
  dateAdded: input.createdAt as unknown as string,
  avatar: { url: input.avatar.url, previewUrl: input.avatar.previewUrl },
});
