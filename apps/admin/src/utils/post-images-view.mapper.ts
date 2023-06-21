import { type AvatarViewModel } from './common.interfaces';

export interface PostImagesInput {
  images: AvatarViewModel[];
}

export const toPostImagesViewModel = (
  input: PostImagesInput,
): AvatarViewModel[] =>
  input.images.map((image) => ({
    url: image.url,
    previewUrl: image.previewUrl,
  }));
