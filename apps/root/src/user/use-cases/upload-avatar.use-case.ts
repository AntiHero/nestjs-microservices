import { randomUUID } from 'crypto';

import { updatedAvatarMessageCreator } from '@app/common/message-creators/updated-avatar.message-creator';
import { RootEvent } from '@app/common/patterns/root.pattern';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { Avatar } from '@prisma/client';

import { PREVIEW_HEIGHT, PREVIEW_WIDTH } from 'apps/root/src/common/constants';
import {
  AvatarCreationError,
  FILE_UPLOAD_ERROR,
} from 'apps/root/src/common/errors';
import { ImageService } from 'apps/root/src/common/services/image.service';
import { CloudStrategy } from 'apps/root/src/common/strategies/cloud.strategy';

import { NOTIFY_ADMIN_EVENT } from '../../common/event-router';
import { ImagesQueryRepositoryAdapter } from '../repositories/adapters/images-query-repository.adapter';
import { ImagesRepositoryAdapter } from '../repositories/adapters/images-repository.adapter';

export class UploadAvatarCommand {
  public constructor(public userId: string, public file: Express.Multer.File) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarUseCase implements ICommandHandler {
  public constructor(
    private readonly avatarsQueryRepository: ImagesQueryRepositoryAdapter<Avatar>,
    private readonly avatarsRepository: ImagesRepositoryAdapter<Avatar>,
    private readonly cloudService: CloudStrategy,
    private readonly imageService: ImageService,
    private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(command: UploadAvatarCommand): Promise<Avatar | null> {
    const { userId, file } = command;

    const existingAvatar = await this.avatarsQueryRepository.findByUserId(
      userId,
    );

    const { url: existingUrl, previewUrl: existingPreviewUrl } =
      existingAvatar ?? {};

    try {
      const { size, width, height } = await this.imageService.getMetadata(
        file.buffer,
      );

      const ext = file.originalname.split('.')[1];
      const avatarName = `${randomUUID()}.${ext}`;
      const avatarPath = `${this.createPrefix(userId)}${avatarName}`;

      const preview = await this.imageService.resize(file, {
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
      });

      const previewName = `${randomUUID()}.${ext}`;
      const previewPath = `${this.createPrefix(userId)}.preivew.${previewName}`;

      const [url, previewUrl] = await Promise.all([
        this.cloudService.upload(avatarPath, file),
        this.cloudService.upload(previewPath, preview),
      ]);

      const avatarPayload = {
        url,
        previewUrl,
        size,
        height,
        width,
      };

      const avatar = await this.avatarsRepository.create(userId, avatarPayload);

      if (existingUrl && existingPreviewUrl) {
        await this.cloudService.remove([existingUrl, existingPreviewUrl]);
      }

      const message = updatedAvatarMessageCreator({
        userId,
        url,
        previewUrl,
      });

      this.eventEmitter.emit(NOTIFY_ADMIN_EVENT, [
        RootEvent.UpdatedAvatar,
        message,
      ]);

      return avatar;
    } catch (error) {
      console.log(error);

      throw new AvatarCreationError(FILE_UPLOAD_ERROR);
    }
  }

  private createPrefix(userId: string) {
    return `content/users/${userId}/avatar/`;
  }
}
