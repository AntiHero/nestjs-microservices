export interface Err {
  errorCode: number;
  errorMessage: string;
}

export interface Result<T> {
  data: T;
  err?: Err | null;
}
export const Result = function Result<T>(
  this: Result<T>,
  data: T,
  errorCode?: number,
  errorMessage?: string,
) {
  this.data = data;

  if (errorCode && errorMessage) this.err = { errorCode, errorMessage };

  return this;
} as unknown as new <T>(
  data: T,
  errorCode?: number,
  errorMessage?: string,
) => Result<T>;
