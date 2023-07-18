import { Queue }                      from '@app/common/queues';
import { RmqModule as BaseRmqModule } from '@app/common/src/rmq/rmq.module';
import { RmqClientToken }             from '@app/common/tokens';
import { Global, Module }             from '@nestjs/common';

@Global()
@Module({
  imports: [
    BaseRmqModule.register({
      name: RmqClientToken.ADMIN_RMQ,
      queue: Queue.Admin,
    }),
  ],
  exports: [BaseRmqModule],
})
export class RmqModule {}
