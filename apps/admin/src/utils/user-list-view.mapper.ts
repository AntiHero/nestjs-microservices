import { UserModel } from '../app/entity/user.model';

export interface UserViewModel {
  userId: string;
  username: string;
  profileLink: string;
  dataAdded: string;
}

export const toUserViewModel = (input: UserModel): UserViewModel => ({
  userId: input.id,
  username: input.username,
  profileLink: `${process.env.FRONTEND_DOMAIN}/users/${input.username}`,
  dataAdded: input.createdAt as unknown as string,
});
