const TARGET = 'subscriptions';
export const GET_PRICES = `${TARGET}:get-prices`;

export const SUBSCRIPTIONS_PATTERNS = {
  ROOT: 'subscriptions',
  GET_PRICES() {
    return `${this.ROOT}:get_prices`;
  },
  GET_CHECKOUT_SESSION_URL() {
    return `${this.ROOT}:get_checkout_session_url`;
  },
  GET_PAYMENTS() {
    return `${this.ROOT}:get_user_payments`;
  },
  CANCEL_SUBSCRIPTION() {
    return `${this.ROOT}:cancel_subscription`;
  },
  GET_CURRENT_SUBSCRIPTION() {
    return `${this.ROOT}:get_current_subscription`;
  },
};
