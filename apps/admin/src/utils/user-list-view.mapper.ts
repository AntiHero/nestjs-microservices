import { UserModel } from '../app/entity/user.model';

export interface UserViewModel {
  userId: string;
  username: string;
  profileLink: string;
  dataAdded: Date;
}

export const toUserViewModel = (input: UserModel): UserViewModel => ({
  userId: input.id,
  username: input.username,
  profileLink: `${process.env.FRONTEND_DOMAIN}/users/${input.username}`,
  dataAdded: <Date>input.createdAt,
});
