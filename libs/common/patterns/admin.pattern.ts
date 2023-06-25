class AdminCommand {
  private static patternIssuer = 'admin';

  private static createPattern = (message: string) =>
    `${AdminCommand.patternIssuer}:${message}`;

  public static GetUserList = AdminCommand.createPattern('get_user_list');

  public static DeleteUser = AdminCommand.createPattern('delete_user');

  public static BanUser = AdminCommand.createPattern('ban_user');
}

export { AdminCommand };
