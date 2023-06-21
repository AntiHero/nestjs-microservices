import { type Avatar } from '@prisma/client';

export type UpdatedAvatarType = Pick<Avatar, 'url' | 'previewUrl' | 'userId'>;

export const updatedAvatarMessageCreator = (
  data: UpdatedAvatarType,
): UpdatedAvatarType => data;
