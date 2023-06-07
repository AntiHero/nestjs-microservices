export type ErrorResult = {
  errorCode: number;
  message: string;
};

export type Result<T = null, E = ErrorResult> = {
  data: T;
  err?: E;
};
