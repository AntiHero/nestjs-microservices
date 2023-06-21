import { RootEvents }     from '@app/common/patterns/root.pattern';
import { Controller }     from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AdminMessageConroller {
  @MessagePattern(RootEvents.CreatedUser)
  public async createUser(data: any) {
    console.log(data);
  }
}
