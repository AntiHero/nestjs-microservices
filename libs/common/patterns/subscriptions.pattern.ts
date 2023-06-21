class SubscriptionCommand {
  private static patternIssuer = 'subscriptions';

  private static createPattern = (message: string) =>
    `${this.patternIssuer}:${message}`;

  public static GetPrices = this.createPattern('get_prices');

  public static GetCheckoutSessionUrl = this.createPattern(
    'get_checkout_session_url',
  );

  public static GetUserPayments = this.createPattern('get_user_payments');

  public static CancelSubscription = this.createPattern('cancel_subscription');

  public static GetCurrentSubscription = this.createPattern(
    'get_current_subscription',
  );

  public static UpdateUserAccountPlan = this.createPattern(
    'update_user_account_plan',
  );

  public static GetUserInfo = this.createPattern('get_user_info');
}

class SubscriptionEvent {
  private static patternIssuer = 'subscriptions';

  private static createPattern = (message: string) =>
    `${this.patternIssuer}:${message}`;

  public static SubscriptionCreated = this.createPattern(
    'subscription_created',
  );
}

export { SubscriptionCommand, SubscriptionEvent };
