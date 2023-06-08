export const setEnvVariable = <T>(prod: T, dev?: T) => {
  if (process.env.MODE === 'production') return prod;

  console.log(prod, dev);
  return dev ?? prod;
};
