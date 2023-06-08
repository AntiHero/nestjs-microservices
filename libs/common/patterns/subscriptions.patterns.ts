export const SUBSCRIPTIONS_PATTERNS = {
  ROOT: 'subscriptions',
  GET_PRICES: () => `${SUBSCRIPTIONS_PATTERNS.ROOT}:get_prices`,
  GET_CHECKOUT_SESSION_URL: () =>
    `${SUBSCRIPTIONS_PATTERNS.ROOT}:get_checkout_session_url`,
  GET_PAYMENTS: () => `${SUBSCRIPTIONS_PATTERNS.ROOT}:get_user_payments`,
  CANCEL_SUBSCRIPTION: () =>
    `${SUBSCRIPTIONS_PATTERNS.ROOT}:cancel_subscription`,
  GET_CURRENT_SUBSCRIPTION: () =>
    `${SUBSCRIPTIONS_PATTERNS.ROOT}:get_current_subscription`,
};

const root = 'subscriptions';

const createPattern = (msg: string) => `${root}:${msg}`;

export const SubscriptionPatterns = {
  getPrices: createPattern('get_prices'),
  getCheckoutSessionUrl: createPattern('get_checkout_session_url'),
  getUserPayments: createPattern('get_user_payments'),
  cancelSubscription: createPattern('cancel_subscription'),
  getCurrentSubscription: createPattern('get_current_subscription'),
};
