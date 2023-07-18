import { UserClass } from '../app/entity/user.model';

export interface UserViewModel {
  id: string;
  username: string;
  profileLink: string;
  dateAdded: string;
  isBanned: boolean;
}

export const toUserViewModel = (input: UserClass): UserViewModel => ({
  id: input.id,
  username: input.username,
  isBanned: input.isBanned,
  profileLink: `${process.env.FRONTEND_DOMAIN}/users/${input.username}`,
  dateAdded: input.createdAt as unknown as string,
});
