import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ABOUT_ME_LENGTH_MAX,
  ABOUT_ME_LENGTH_MIN,
  CITY_LENGTH_MAX,
  CITY_LENGTH_MIN,
  MIN_AVATAR_HEIGHT,
  MIN_AVATAR_WIDTH,
  NAME_LENGTH_MAX,
  NAME_LENGTH_MIN,
  SURNAME_LENGTH_MAX,
  SURNAME_LENGTH_MIN,
  USERNAME_LENGTH_MAX,
  USERNAME_LENGTH_MIN,
} from 'apps/root/src/common/constants';
import { FieldError }                  from 'apps/root/src/types';

export function UploadUserAvatarApiDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload user avatar with preview',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'File to upload',
      required: true,
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiBearerAuth(),
    ApiCreatedResponse({
      status: 201,
      description: 'User avatar has been successfuly uploaded',
      schema: {
        type: 'object',
        example: {
          url: 'https://cloud.image.png',
          previewUrl: 'https://cloud.preview.image.png',
        },
      },
    }),
    ApiBadRequestResponse({
      description: `If the InputModel has incorrect values \n
    1. Image dimensions are less than ${MIN_AVATAR_WIDTH}px x ${MIN_AVATAR_HEIGHT}px \n
    2. Wrong format (png, jpeg, jpg are allowed) \n
    3. Image size > 2Mb
    `,
      type: FieldError,
    }),
    ApiNotFoundResponse({
      description: 'User with such id was not found',
      type: FieldError,
    }),
    ApiInternalServerErrorResponse({
      description: 'Could not upload a file',
      type: FieldError,
    }),
  );
}

export function GetProfileApiDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user profile',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      schema: {
        type: 'object',
        example: {
          username: 'Leon Kennedy',
          name: 'John',
          surname: 'Doe',
          birthday: '1990-01-01',
          city: 'SecretCity',
          aboutMe: "I'm from Raccoon city...",
          avatar: {
            url: 'http://cloud.image.png',
            previewUrl: 'http://cloud.preview.image.png',
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
    ApiUnauthorizedResponse({
      description: 'JWT accessToken is missing, expired, or incorrect',
    }),
    ApiBearerAuth(),
  );
}

export function CreateProfileApiDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create user profile',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['name', 'surname', 'city'],
        properties: {
          name: {
            type: 'string',
            example: 'John',
          },
          surname: {
            type: 'string',
            example: 'Doe',
          },
          birthday: {
            type: 'string',
            example: '1990-01-01',
          },
          city: {
            type: 'string',
            example: 'City',
          },
          aboutMe: {
            type: 'string',
            example: 'I am a secret agent...',
          },
        },
      },
    }),
    ApiNoContentResponse({
      description: 'User account has been created',
    }),
    ApiBadRequestResponse({
      description: 'Invalid input values',
      type: FieldError,
    }),
    ApiNotFoundResponse({
      description: 'User with the specified ID not found',
    }),
    ApiUnauthorizedResponse({
      description: 'JWT accessToken is missing, expired, or incorrect',
    }),
    ApiForbiddenResponse({
      description:
        'Account already created or user has not confirmed their email',
    }),
    ApiBearerAuth(),
  );
}

export function UpdateProfileApiDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update user profile',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            example: 'Leon Kennedy',
          },
          name: {
            type: 'string',
            example: 'John',
          },
          surname: {
            type: 'string',
            example: 'Doe',
          },
          birthday: {
            type: 'string',
            example: '1990-01-01',
          },
          city: {
            type: 'string',
            example: 'City',
          },
          aboutMe: {
            type: 'string',
            example: "I'm from Raccoon city...",
          },
        },
      },
    }),
    ApiNoContentResponse({
      description: 'User account has been updated',
    }),
    ApiBadRequestResponse({
      description: 'Invalid input values',
      type: FieldError,
    }),
    ApiNotFoundResponse({
      description:
        'User with the specified ID or corresponding account not found',
    }),
    ApiUnauthorizedResponse({
      description: 'JWT accessToken is missing, expired, or incorrect',
    }),
    ApiForbiddenResponse({
      description: 'User has not confirmed their email',
    }),
    ApiBearerAuth(),
  );
}
