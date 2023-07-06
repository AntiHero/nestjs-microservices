import { CallHandler, Injectable } from '@nestjs/common';
import { tap, throwError }         from 'rxjs';

import {
  CircuitBrakerParams,
  CircuitBreakerState,
} from './cirucit-breaker.enum';

@Injectable()
export class CircuitBreaker {
  private state = CircuitBreakerState.CLOSED;

  private failureCount = 0;

  private successCount = 0;

  private lastError: Error | null = null;

  private nextAttempt = 0;

  public exec(next: CallHandler) {
    if (this.state === CircuitBreakerState.OPEN) {
      if (this.nextAttempt > Date.now()) {
        return throwError(() => this.lastError);
      }

      this.state = CircuitBreakerState.HALF_OPEN;
    }

    return next.handle().pipe(
      tap({
        next: () => {
          this.successHandler();
        },
        error: (err) => {
          this.errorHandler(err);
        },
      }),
    );
  }

  public successHandler() {
    if (this.failureCount) this.failureCount = 0;

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.successCount++;

      if (this.successCount >= CircuitBrakerParams.SUCCESS_THRESHOLD) {
        this.state = CircuitBreakerState.CLOSED;
      }
    }
  }

  public errorHandler(err: Error) {
    this.failureCount++;

    if (this.successCount) this.successCount = 0;

    if (
      this.failureCount >= CircuitBrakerParams.FAILURE_THRESHOLD ||
      this.state === CircuitBreakerState.HALF_OPEN
    ) {
      this.state = CircuitBreakerState.OPEN;
      this.lastError = err;
      this.nextAttempt = Date.now() + CircuitBrakerParams.RESET_TIMEOUT;
    }
  }
}
