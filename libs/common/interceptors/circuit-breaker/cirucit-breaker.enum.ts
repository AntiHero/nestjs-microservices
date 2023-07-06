export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export enum CircuitBrakerParams {
  FAILURE_THRESHOLD = 3,
  SUCCESS_THRESHOLD = 3,
  RESET_TIMEOUT = 30_000,
}
