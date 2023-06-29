import { ApiProperty } from '@nestjs/swagger';

export class FieldError {
  @ApiProperty()
  public statusCode: string;

  @ApiProperty()
  public message: string[];

  @ApiProperty()
  public path: string;
}

export class LogginSuccessViewModel {
  @ApiProperty()
  public accessToken: string;
}
