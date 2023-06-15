export const ROOT_PATTERNS = {
  ROOT: 'root',
  GET_USER_INFO() {
    return `${this.ROOT}:get_user_info`;
  },
  UPDATE_USER_ACCOUNT_PLAN() {
    return `${this.ROOT}:update_user_account_plan`;
  },
};

const issuer = 'root';

const createPattern = (msg: string) => `${issuer}:${msg}`;

export const RootPatterns = {
  updateUserAccountPlan: createPattern('update_user_account_plan'),
};
