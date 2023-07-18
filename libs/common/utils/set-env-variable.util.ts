import { NotUndefined } from '../types/not-undefined.type';

export const setEnvVariable = <T>(
  prod: T,
  dev?: T | undefined,
): NotUndefined<T> => {
  return (
    process.env.MODE === 'production' ? prod : dev ?? prod
  ) as NotUndefined<T>;
};
