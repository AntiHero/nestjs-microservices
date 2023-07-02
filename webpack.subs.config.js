const { resolve } = require('path');

module.exports = function (options) {
  return {
    ...options,
    entry: {
      worker: resolve(
        process.cwd(),
        'apps/subscriptions/src/worker/outbox.worker.ts',
      ),
      main: resolve(process.cwd(), 'apps/subscriptions/src/main.ts'),
    },
    output: {
      path: resolve(process.cwd(), 'dist/apps/subscriptions'),
    },
  };
};
