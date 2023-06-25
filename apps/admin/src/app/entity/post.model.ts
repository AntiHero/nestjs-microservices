import type { Image, Post }                     from '@prisma/client';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { TimeStamps }                           from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({
  schemaOptions: {
    discriminatorKey: '',
    _id: false,
  },
})
export class ImageModel
  extends TimeStamps
  implements
    Record<Exclude<keyof Image, 'createdAt' | 'updatedAt' | 'postId'>, any>
{
  @prop({ unique: true })
  public id: string;

  @prop()
  public url: string;

  @prop({ type: () => String, default: null })
  public previewUrl: string | null;
}

export class PostClass
  extends TimeStamps
  implements Record<Exclude<keyof Post, 'createdAt' | 'updatedAt'>, any>
{
  @prop({ unique: true })
  public id: string;

  @prop()
  public userId: string;

  @prop({ type: () => String, default: null })
  public description: string | null;

  @prop({ type: () => [ImageModel], default: [] })
  public images: ImageModel[];

  @prop({ default: false })
  public isDeleted: boolean;
}

export const PostModel = getModelForClass(PostClass, {
  options: {
    customName: 'posts',
  },
});
