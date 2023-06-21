class AdminCommand {
  private static patternIssuer = 'admin';

  private static createPattern = (message: string) =>
    `${AdminCommand.patternIssuer}:${message}`;

  public static GetUserList = AdminCommand.createPattern('get_user_list');

  public static DeleteUser = AdminCommand.createPattern('delete_user');
}

export { AdminCommand };
