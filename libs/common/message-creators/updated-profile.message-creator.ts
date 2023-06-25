import { type Profile } from '@prisma/client';

export type UpdatedProfileType = Partial<
  Pick<Profile, 'aboutMe' | 'birthday' | 'city' | 'name' | 'surname'>
> &
  Pick<Profile, 'userId'>;

export const updatedProfileMessageCreator = ({
  userId,
  aboutMe,
  birthday,
  city,
  name,
  surname,
}: UpdatedProfileType): UpdatedProfileType => {
  const result: UpdatedProfileType = {
    userId,
  };

  aboutMe !== undefined && (result.aboutMe = aboutMe);
  birthday !== undefined && (result.birthday = birthday);
  city !== undefined && (result.city = city);
  name !== undefined && (result.name = name);
  surname !== undefined && (result.surname = surname);

  return result;
};
