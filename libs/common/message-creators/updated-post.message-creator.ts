import { type Post } from '@prisma/client';

export type UpdatedPostType = Pick<Post, 'id' | 'description'>;

export const updatedPostMessageCreator = (id: string, description: string) => ({
  id,
  description,
});
