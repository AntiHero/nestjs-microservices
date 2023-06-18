import { Controller, Get } from '@nestjs/common';

@Controller()
export class AdminController {
  @Get()
  async healthCheck() {
    return 'ok';
  }
}
