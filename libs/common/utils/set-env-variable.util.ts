export const setEnvVariable = <T>(prod: T, dev?: T) => {
  if (process.env.MODE === 'production') return prod;

  return dev ?? prod;
};
