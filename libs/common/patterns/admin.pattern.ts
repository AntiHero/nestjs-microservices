const issuer = 'admin';

export namespace AdminCommand {
  export const GetUserList = `${issuer}:get_user_list`;

  export const DeleteUser = `${issuer}:delete_user`;
}
