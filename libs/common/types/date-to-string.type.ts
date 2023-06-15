export type DateToStringInterfaceRemap<T> = T extends Record<any, any>
  ? { [key in keyof T]: T[key] extends Date | undefined ? string : T[key] }
  : never;
