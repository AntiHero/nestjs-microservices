import { Module }                        from '@nestjs/common';
import { CqrsModule }                    from '@nestjs/cqrs';
import { PrismaClient }                  from '@prisma/client';

import { ImageService }                  from 'apps/root/src/common/services/image.service';
import { SharpService }                  from 'apps/root/src/common/services/sharp.service';
import { CloudStrategy }                 from 'apps/root/src/common/strategies/cloud.strategy';
import { YandexCloudStrategy }           from 'apps/root/src/common/strategies/yandex-cloud.strategy';

import { UsersController }               from './api/users.controller';
import { ImagesQueryRepositoryAdapter }  from './repositories/adapters/images-query-repository.adapter';
import { ImagesRepositoryAdapter }       from './repositories/adapters/images-repository.adapter';
import { PostsRepositoryAdapter }        from './repositories/adapters/post/posts.adapter';
import { PostsQueryRepositoryAdatapter } from './repositories/adapters/post/posts.query-adapter';
import { ProfileQueryRepositoryAdapter } from './repositories/adapters/profile-query-repository.adapter';
import { ProfileRepositoryAdapter }      from './repositories/adapters/profile-repository.adapter';
import { AvatarsQueryRepository }        from './repositories/avatars.query-repository';
import { AvatarsRepository }             from './repositories/avatars.repository';
import { PostsQueryRepository }          from './repositories/post/posts.query-repository';
import { PostsRepository }               from './repositories/post/posts.repository';
import { ProfileQueryRepository }        from './repositories/profile.query-repository';
import { ProfileRepository }             from './repositories/profile.repository';
import { UserRepository }                from './repositories/user.repository';
import { CreateProfileUseCase }          from './use-cases/create-profile.use-case';
import { CreatePostUseCase }             from './use-cases/post/create-post.use-case';
import { DeletePostUseCase }             from './use-cases/post/delete-post.use-case';
import { UpdatePostUseCase }             from './use-cases/post/update-post.use-case';
import { UpdateProfileUseCase }          from './use-cases/update-profile.use-case';
import { UploadAvatarUseCase }           from './use-cases/upload-avatar.use-case';

const useCases = [
  UploadAvatarUseCase,
  CreateProfileUseCase,
  UpdateProfileUseCase,
  CreatePostUseCase,
  DeletePostUseCase,
  UpdatePostUseCase,
];

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    UserRepository,
    PrismaClient,
    ...useCases,
    {
      provide: CloudStrategy,
      useClass: YandexCloudStrategy,
    },
    {
      provide: ImagesQueryRepositoryAdapter,
      useClass: AvatarsQueryRepository,
    },
    {
      provide: ImagesRepositoryAdapter,
      useClass: AvatarsRepository,
    },
    {
      provide: ImageService,
      useClass: SharpService,
    },
    {
      provide: ProfileRepositoryAdapter,
      useClass: ProfileRepository,
    },
    {
      provide: ProfileQueryRepositoryAdapter,
      useClass: ProfileQueryRepository,
    },
    {
      provide: PostsRepositoryAdapter,
      useClass: PostsRepository,
    },
    {
      provide: PostsQueryRepositoryAdatapter,
      useClass: PostsQueryRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}
