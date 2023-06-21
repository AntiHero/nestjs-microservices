import { type Profile } from '@prisma/client';

export type UpdatedProfileType = Partial<
  Pick<Profile, 'aboutMe' | 'birthday' | 'city' | 'name' | 'surname'>
> &
  Pick<Profile, 'userId'>;

export const updatedProfileMessageCreator = ({
  userId,
  aboutMe = null,
  birthday = null,
  city = null,
  name = null,
  surname = null,
}: UpdatedProfileType): UpdatedProfileType => ({
  userId,
  birthday,
  aboutMe,
  name,
  surname,
  city,
});
