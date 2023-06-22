/* eslint-disable @typescript-eslint/no-empty-interface */
import type { Image, Post } from '@prisma/client';
import { prop }             from '@typegoose/typegoose';
import { TimeStamps }       from '@typegoose/typegoose/lib/defaultClasses';

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

export class PostModel
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
}
