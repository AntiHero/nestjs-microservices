import assert          from 'assert';

import { DeepPartial } from '../types/deep-partial.type';

export function applyUpdates<T extends Record<string, any>>(
  t: T,
  u: DeepPartial<T>,
): T {
  assert.ok(typeof t === 'object', 'The input "t" must be an object');
  assert.ok(typeof u === 'object', 'The input "u" must be an object');

  if (!u) return t;

  const m = { ...t };
  Object.setPrototypeOf(m, t);

  for (const k in u) {
    if (typeof u[k] === 'object' && u[k] !== null && !Array.isArray(u[k])) {
      m[k] = applyUpdates(m[k] || ({} as any), u[k]);
    } else {
      m[k] = u[k]!;
    }
  }

  return m;
}
