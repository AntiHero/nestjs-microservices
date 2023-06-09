import { randomUUID }                               from 'crypto';

import { createdPostMessageCreator }                from '@app/common/message-creators/created-post.message-creator';
import { RootEvent }                                from '@app/common/patterns/root.pattern';
import { CommandHandler, ICommandHandler }          from '@nestjs/cqrs';
import { EventEmitter2 as EventEmitter }            from '@nestjs/event-emitter';

import {
  POST_PREVIEW_HEIGHT,
  POST_PREVIEW_WIDTH,
} from 'apps/root/src/common/constants';
import {
  POST_CREATION_ERROR,
  PostCreationError,
} from 'apps/root/src/common/errors';
import { NOTIFY_ADMIN_EVENT }                       from 'apps/root/src/common/event-router';
import { ImageService }                             from 'apps/root/src/common/services/image.service';
import { CloudStrategy }                            from 'apps/root/src/common/strategies/cloud.strategy';
import { PrismaService }                            from 'apps/root/src/prisma/prisma.service';

import type { CreatePostResult, ImageCreationData } from '../../types';

export class CreatePostCommand {
  public constructor(
    public userId: string,
    public images: Express.Multer.File[],
    public description: string,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler {
  public constructor(
    private readonly cloudService: CloudStrategy,
    private readonly imageService: ImageService,
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(command: CreatePostCommand): Promise<CreatePostResult> {
    const { userId, images, description } = command;

    const postId = randomUUID();

    try {
      const imagesWithPaths: [string, Express.Multer.File][] = [];
      const imagesMetadata: { size: number; width: number; height: number }[] =
        [];

      for (const image of images) {
        const { size, width, height } = await this.imageService.getMetadata(
          image.buffer,
        );

        imagesMetadata.push({
          size: size || 0,
          width: width || 0,
          height: height || 0,
        });

        const ext = image.originalname.split('.')[1];
        const imageName = `${randomUUID()}.${ext}`;
        const imagePath = `${this.createPrefix(userId, postId)}${imageName}`;

        const preview = await this.imageService.resize(image, {
          width: POST_PREVIEW_WIDTH,
          height: POST_PREVIEW_HEIGHT,
        });

        const previewName = `${randomUUID()}.${ext}`;
        const previewPath = `${this.createPrefix(
          userId,
          postId,
        )}.preivew.${previewName}`;

        imagesWithPaths.push([imagePath, image]);
        imagesWithPaths.push([previewPath, preview]);
      }

      return this.prismaService.$transaction(async (prisma) => {
        const imagesUrls = await Promise.all(
          imagesWithPaths.map(([path, file]) =>
            this.cloudService.upload(path, file),
          ),
        );

        const imageCreationData: ImageCreationData[] = images.map((_, idx) => {
          return {
            metadata: {
              ...(imagesMetadata[idx] ?? {}),
            },
            url: imagesUrls[idx * 2],
            previewUrl: imagesUrls[idx * 2 + 1],
          };
        });

        const result = await prisma.post.create({
          data: {
            id: postId,
            userId,
            description,
            images: {
              create: [
                ...imageCreationData.map((info) => ({
                  url: info.url,
                  previewUrl: info.previewUrl,
                  metadata: {
                    create: {
                      ...info.metadata,
                    },
                  },
                })),
              ],
            },
          },
          include: {
            images: {
              include: {
                metadata: {},
              },
            },
          },
        });

        const { id, createdAt, images: postImages } = result;

        const message = createdPostMessageCreator({
          id,
          description,
          userId,
          createdAt,
          images: postImages.map(({ url, previewUrl, id }) => ({
            id,
            url,
            previewUrl,
          })),
        });

        this.eventEmitter.emit(NOTIFY_ADMIN_EVENT, [
          RootEvent.CreatedPost,
          message,
        ]);

        return result;
      });
    } catch (error) {
      console.log(error);

      throw new PostCreationError(POST_CREATION_ERROR);
    }
  }

  private createPrefix(userId: string, postId: string) {
    return `content/users/${userId}/posts/${postId}/`;
  }
}
