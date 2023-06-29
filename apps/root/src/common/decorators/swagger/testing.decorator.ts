import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse }   from '@nestjs/swagger';

export function TestingRemoveAllDataDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Clear database: delete all data from all tables',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'All data is deleted',
    }),
  );
}
