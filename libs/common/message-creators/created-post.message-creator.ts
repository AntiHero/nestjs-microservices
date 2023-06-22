import { Image, Post } from '@prisma/client';

export type CreatedPostType = Pick<
  Post,
  'userId' | 'description' | 'createdAt' | 'id'
> & {
  images: Pick<Image, 'url' | 'previewUrl'>[];
};

export const createdPostMessageCreator = (
  data: CreatedPostType,
): CreatedPostType => data;
