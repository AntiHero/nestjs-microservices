/* eslint-disable @typescript-eslint/no-empty-interface */
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import type { Image, Post } from '@prisma/client';
import { prop } from '@typegoose/typegoose';

// export interface MetadataModel extends Base {}
// export class MetadataModel
//   extends TimeStamps
//   implements
//     Record<Exclude<keyof ImageMetadata, 'createdAt' | 'updatedAt'>, any>
// {
//   @prop({ unique: true })
//   public id: string;

//   @prop()
//   public size: number;

//   @prop()
//   public height: number;

//   @prop()
//   public width: number;

//   @prop()
//   public imageId: string;
// }

export interface ImageModel extends Base {}
export class ImageModel
  extends TimeStamps
  implements Record<Exclude<keyof Image, 'createdAt' | 'updatedAt'>, any>
{
  @prop({ unique: true })
  public id: string;

  @prop()
  public url: string;

  @prop({ type: () => String, default: null })
  public previewUrl: string | null;

  @prop()
  public postId: string;

  // @prop(() => MetadataModel)
  // public metadata: MetadataModel;
}

export interface PostModel extends Base {}
export class PostModel
  extends TimeStamps
  implements Record<Exclude<keyof Post, 'createdAt' | 'updatedAt'>, any>
{
  @prop({ unique: true })
  public id: string;

  @prop()
  public userId: string;

  @prop()
  public description: string;

  @prop({ type: () => [ImageModel], default: [] })
  public images: ImageModel[];
}
