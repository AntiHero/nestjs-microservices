import { type Post } from '@prisma/client';

export type UpdatedPostType = Pick<Post, 'id' | 'description'>;

export const updatedPostMessageCreator = (data: UpdatedPostType) => data;
