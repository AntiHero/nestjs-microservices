import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable }                                     from 'rxjs';

import { CircuitBreaker }                                 from './cirucit-breaker';

export class CircuitBreakerInterceptor implements NestInterceptor {
  private readonly circuitBreakerByHandler = new WeakMap<
    // eslint-disable-next-line @typescript-eslint/ban-types
    Function,
    CircuitBreaker
  >();

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const methodRef = context.getHandler();

    let circuitBreaker: CircuitBreaker;

    const existingCircuitBreaker = this.circuitBreakerByHandler.get(methodRef);

    if (existingCircuitBreaker) {
      circuitBreaker = existingCircuitBreaker;
    } else {
      circuitBreaker = this.circuitBreakerByHandler
        .set(methodRef, new CircuitBreaker())
        .get(methodRef) as CircuitBreaker;
    }

    return circuitBreaker.exec(next);
  }
}
