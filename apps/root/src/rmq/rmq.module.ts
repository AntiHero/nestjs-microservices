import { RmqModule as BaseRmqModule } from '@app/common/src/rmq/rmq.module';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    BaseRmqModule.register({
      name: 'ADMIN_RMQ',
      queue: 'admin',
    }),
  ],
  exports: [BaseRmqModule],
})
export class RmqModule {}
