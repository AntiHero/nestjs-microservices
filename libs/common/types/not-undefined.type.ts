export type NotUndefined<T> = T extends any | undefined
  ? Exclude<T, undefined>
  : false;
