import { applyUpdates } from './apply-updates.util';

describe('applyUpdates', () => {
  it('should apply updates correctly', () => {
    const obj = {
      userId: 1,
      username: 'bob',
      profile: {
        firstName: 'bob',
        lastName: 'dylan',
        city: null,
      },
    };

    const updates = {
      username: 'alice',
      profile: {
        city: 'Raccon',
      },
    };

    const expected = {
      userId: 1,
      username: 'alice',
      profile: {
        firstName: 'bob',
        lastName: 'dylan',
        city: 'Raccon',
      },
    };

    const result = applyUpdates(obj, updates);

    expect(result).toStrictEqual(expected);
  });
});
