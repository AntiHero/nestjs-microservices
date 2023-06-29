import {
  BadRequestException,
  HttpStatus,
  ParseFilePipeBuilder,
} from '@nestjs/common';

import { ImageDimensionsValidatonPipe } from './image-dimensions-validation.pipe';
import { MAX_AVATAR_SIZE }              from '../constants';

export const ImageValidationPipe = <
  T extends {
    fileType: string;
    maxSize?: number;
    minHeight?: number;
    minWidth?: number;
  },
>(
  args: T,
) => {
  const { fileType, maxSize = MAX_AVATAR_SIZE, minHeight, minWidth } = args;

  const pipeBuilder = new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType,
    })
    .addMaxSizeValidator({
      maxSize,
    });

  if (minHeight && minWidth) {
    pipeBuilder.addValidator(
      new ImageDimensionsValidatonPipe({
        minWidth,
        minHeight,
      }),
    );
  }

  return pipeBuilder.build({
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    exceptionFactory: (err) => {
      throw new BadRequestException(err);
    },
  });
};
