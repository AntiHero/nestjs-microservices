import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health-check')
  public healtCheck() {
    return;
  }

  // for deployment to google cloud
  @Get()
  public root() {
    return;
  }
}
