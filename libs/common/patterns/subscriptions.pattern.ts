// export const SUBSCRIPTIONS_PATTERNS = {
//   ROOT: 'subscriptions',
//   GET_PRICES: () => `${SUBSCRIPTIONS_PATTERNS.ROOT}:get_prices`,
//   GET_CHECKOUT_SESSION_URL: () =>
//     `${SUBSCRIPTIONS_PATTERNS.ROOT}:get_checkout_session_url`,
//   GET_PAYMENTS: () => `${SUBSCRIPTIONS_PATTERNS.ROOT}:get_user_payments`,
//   CANCEL_SUBSCRIPTION: () =>
//     `${SUBSCRIPTIONS_PATTERNS.ROOT}:cancel_subscription`,
//   GET_CURRENT_SUBSCRIPTION: () =>
//     `${SUBSCRIPTIONS_PATTERNS.ROOT}:get_current_subscription`,
// };

const root = 'subscriptions';

const createPattern = (msg: string) => `${root}:${msg}`;

export const SubscriptionCommand = {
  GetPrices: createPattern('get_prices'),
  GetCheckoutSessionUrl: createPattern('get_checkout_session_url'),
  GetUserPayments: createPattern('get_user_payments'),
  CancelSubscription: createPattern('cancel_subscription'),
  GetCurrentSubscription: createPattern('get_current_subscription'),
  UpdateUserAccountPlan: createPattern('update_user_account_plan'),
  GetUserInfo: createPattern('get_user_info'),
};

export const SubscriptionEvent = {
  SubscriptionCreated: createPattern('subscription_created'),
};
