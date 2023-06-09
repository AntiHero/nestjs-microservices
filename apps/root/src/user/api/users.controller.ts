import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus }                           from '@nestjs/cqrs';
import { FileInterceptor, FilesInterceptor }    from '@nestjs/platform-express';
import { ApiTags }                              from '@nestjs/swagger';

import {
  FILES_FIELD,
  FILE_FIELD,
  MAX_IMAGES_COUNT,
  MAX_POST_PHOTO_SIZE,
  MIN_AVATAR_HEIGHT,
  MIN_AVATAR_WIDTH,
} from 'apps/root/src/common/constants';
import { ActiveUser }                           from 'apps/root/src/common/decorators/active-user.decorator';
import {
  CreatePostApiDecorator,
  DeletePostApiDecorator,
  GetPostApiDecorator,
  GetPostsApiDecorator,
  UpdatePostApiDecorator,
} from 'apps/root/src/common/decorators/swagger/posts.decorator';
import {
  GetProfileApiDecorator,
  UpdateProfileApiDecorator,
  UploadUserAvatarApiDecorator,
} from 'apps/root/src/common/decorators/swagger/users.decorator';
import { ImageValidationPipe }                  from 'apps/root/src/common/pipes/image-validation.pipe';
import { MinimizeImagePipe }                    from 'apps/root/src/common/pipes/minimize-image.pipe';

import { JwtGuard }                             from '../../common/guards/jwt-auth.guard';
import { UserEmailConfirmationGuard }           from '../../common/guards/user-confirmation.guard';
import { CreatePostDto }                        from '../dto/create-post.dto';
import { PostsQueryDto }                        from '../dto/posts-query.dto';
import { UpdatePostDto }                        from '../dto/update-post.dto';
import { UpdateUserProfileDto }                 from '../dto/update-user-profile.dto';
import { PostsQueryRepositoryAdatapter }        from '../repositories/adapters/post/posts.query-adapter';
import { ProfileQueryRepositoryAdapter }        from '../repositories/adapters/profile-query-repository.adapter';
import { UserRepository }                       from '../repositories/user.repository';
import { CreatePostResult as CreatePostResult } from '../types';
import { CreatePostCommand }                    from '../use-cases/post/create-post.use-case';
import { DeletePostCommand }                    from '../use-cases/post/delete-post.use-case';
import { UpdatePostCommand }                    from '../use-cases/post/update-post.use-case';
import { UpdateProfileCommand }                 from '../use-cases/update-profile.use-case';
import { UploadAvatarCommand }                  from '../use-cases/upload-avatar.use-case';
import { PostsMapper }                          from '../utils/posts.mapper';
import { ProfileMapper }                        from '../utils/profile-mapper';

@ApiTags('Users')
@UseGuards(JwtGuard, UserEmailConfirmationGuard)
@Controller('/api/users')
export class UsersController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly profileQueryRepository: ProfileQueryRepositoryAdapter,
    private readonly postsQueryRepository: PostsQueryRepositoryAdatapter,
    private readonly userRepository: UserRepository,
  ) {}

  @Post('self/profile/avatar')
  @UploadUserAvatarApiDecorator()
  @UseInterceptors(FileInterceptor(FILE_FIELD))
  public async uploadAvatar(
    @ActiveUser('userId') userId: string,
    @UploadedFile(
      ImageValidationPipe({
        fileType: '.(png|jpeg|jpg)',
        minHeight: MIN_AVATAR_HEIGHT,
        minWidth: MIN_AVATAR_WIDTH,
      }),
      MinimizeImagePipe,
    )
    file: Express.Multer.File,
  ) {
    const { url, previewUrl } = await this.commandBus.execute(
      new UploadAvatarCommand(userId, file),
    );

    return { url, previewUrl };
  }

  @Get('self/profile')
  @GetProfileApiDecorator()
  public async getProfile(@ActiveUser('userId') id: string) {
    const profile =
      await this.profileQueryRepository.findProfileAndAvatarByQuery({ id });

    if (!profile) throw new NotFoundException();

    return ProfileMapper.toViewModel(profile);
  }

  @Put('self/profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateProfileApiDecorator()
  public async updateProfile(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @ActiveUser('userId') userId: string,
  ) {
    return this.commandBus.execute(
      new UpdateProfileCommand(userId, updateUserProfileDto),
    );
  }

  @Post('self/posts')
  @UseInterceptors(FilesInterceptor(FILES_FIELD, MAX_IMAGES_COUNT))
  @CreatePostApiDecorator()
  public async createPost(
    @ActiveUser('userId') userId: string,
    @UploadedFiles(
      ImageValidationPipe({
        fileType: '.(png|jpeg|jpg)',
        maxSize: MAX_POST_PHOTO_SIZE,
      }),
    )
    images: Express.Multer.File[],
    @Body()
    createPostDto: CreatePostDto,
  ) {
    const { description } = createPostDto;

    const result: CreatePostResult = await this.commandBus.execute(
      new CreatePostCommand(userId, images, description),
    );

    return result;
  }

  @Delete('self/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeletePostApiDecorator()
  async deletePost(
    @ActiveUser('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    await this.commandBus.execute(new DeletePostCommand(userId, postId));
  }

  @Patch('self/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePostApiDecorator()
  async updatePost(
    @ActiveUser('userId') userId: string,
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    await this.commandBus.execute(
      new UpdatePostCommand(userId, postId, updatePostDto),
    );
  }

  @Get('self/posts')
  @GetPostsApiDecorator('self')
  async getPosts(
    @ActiveUser('userId') userId: string,
    @Query() postsQuery: PostsQueryDto,
  ) {
    const result = await this.postsQueryRepository.getPostsByQuery(
      userId,
      postsQuery,
    );

    return PostsMapper.toViewModel(result);
  }

  @Get('self/posts/:postId')
  @GetPostApiDecorator()
  async getPost(
    @ActiveUser('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    const post = await this.postsQueryRepository.getPostById(userId, postId);

    if (!post) throw new NotFoundException();

    return post;
  }

  @Get(':username/profile')
  @GetProfileApiDecorator()
  async getAnotherUserProfile(@Param('username') username: string) {
    return this.profileQueryRepository.findProfileAndAvatarByQuery({
      username,
    });
  }

  @Get(':username/posts')
  @GetPostsApiDecorator()
  async getUserPosts(
    @Param('username') username: string,
    @Query() postsQuery: PostsQueryDto,
  ) {
    const user = await this.userRepository.findUserByUserName(username);

    if (!user) throw new NotFoundException();

    const result = await this.postsQueryRepository.getPostsByQuery(
      user.id,
      postsQuery,
    );

    return PostsMapper.toViewModel(result);
  }

  @Get(':username/posts/:postId')
  @GetPostApiDecorator()
  async getUserPost(
    @Param('username') username: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    const user = await this.userRepository.findUserByUserName(username);

    if (!user) throw new NotFoundException();

    const post = await this.postsQueryRepository.getPostById(user.id, postId);

    if (!post) throw new NotFoundException();

    return post;
  }
}
