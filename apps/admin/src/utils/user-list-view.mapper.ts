import { UserClass } from '../app/entity/user.model';

export interface UserViewModel {
  id: string;
  username: string;
  profileLink: string;
  dateAdded: string;
}

export const toUserViewModel = (input: UserClass): UserViewModel => ({
  id: input.id,
  username: input.username,
  profileLink: `${process.env.FRONTEND_DOMAIN}/users/${input.username}`,
  dateAdded: input.createdAt as unknown as string,
});
