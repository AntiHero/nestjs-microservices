export type NotNullable<T> = T extends Record<any, any>
  ? {
      [key in keyof T]: T[key] extends infer R | null ? R : T[key];
    }
  : never;
