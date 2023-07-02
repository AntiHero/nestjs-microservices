import { join }      from 'path';
import { Worker }    from 'worker_threads';

import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Observable, fromEvent } from 'rxjs';

@Injectable()
export class OutboxWorkerService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private worker: Worker;

  private $message: Observable<string>;

  public onApplicationBootstrap() {
    this.worker = new Worker(join(__dirname, 'worker.js'));
    this.$message = fromEvent<string>(this.worker, 'message', (event) => event);

    this.worker.on('error', (error) => {
      console.error('Error in worker:', error);
    });

    this.worker.on('message', (message) => {
      console.log(message);
    });

    this.worker.on('exit', (code) => {
      console.log(`Worker exited with code ${code}`);
    });

    this.$message.subscribe({
      complete() {
        console.log('completed');
      },
      error() {
        console.log('error');
      },
    });

    this.worker.postMessage('start');
  }

  public onApplicationShutdown() {
    this.worker.terminate();
  }
}
