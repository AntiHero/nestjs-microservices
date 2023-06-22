export type DeepPartial<T> = T extends Record<string, infer R>
  ? Partial<{
      [key in keyof T]: DeepPartial<R>;
    }>
  : T;
