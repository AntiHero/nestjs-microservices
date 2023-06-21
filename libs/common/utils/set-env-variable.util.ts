export const setEnvVariable = <T>(prod: T, dev?: T): T => {
  return process.env.MODE === 'production' ? prod : dev ?? prod;
};
