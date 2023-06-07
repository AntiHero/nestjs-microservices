console.log(process.env.ROOT_HOST, 'root host');

export const ROOT_PATTERNS = {
  ROOT: 'root',
  GET_USER_INFO() {
    return `${this.ROOT}:get_user_info`;
  },
};
