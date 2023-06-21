import { Image, Post } from '@prisma/client';

type PostCreatedPayload = Pick<
  Post,
  'userId' | 'description' | 'createdAt' | 'id'
> & {
  images: Pick<Image, 'url' | 'previewUrl'>[];
};

export const createdPostMessageCreator = (
  data: PostCreatedPayload,
): PostCreatedPayload => data;
