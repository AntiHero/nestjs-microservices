import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DeviceViewModel }             from '../../../deviceSessions/types';

export function GetAllDevicesSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all devices with active sessions',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: [DeviceViewModel],
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or expired JWT refreshToken in the cookie',
    }),
    ApiCookieAuth(),
  );
}

export function DeleteAllDevicesSessionsButActiveSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: "Terminate all other device's sessions (except current)",
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Success',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or expired JWT refreshToken in the cookie',
    }),
    ApiCookieAuth(),
  );
}

export function DeleteDeviceSessionSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Terminate specified device session',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Success',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or expired JWT refreshToken in the cookie',
    }),
    ApiForbiddenResponse({
      description: "Deleting another user's device session",
    }),
    ApiNotFoundResponse({
      description: 'Device session not found for the given deviceId',
    }),
    ApiCookieAuth(),
  );
}
