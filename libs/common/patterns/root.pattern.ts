class RootEvent {
  private static patternIssuier = 'root';

  private static createPattern = (message: string): string =>
    `${RootEvent.patternIssuier}:${message}`;

  public static ConfirmedEmail = RootEvent.createPattern('confirmed_email');

  public static CreatedPost = RootEvent.createPattern('created_post');

  public static CreatedUser = RootEvent.createPattern('created_user');

  public static DeletedPost = RootEvent.createPattern('deleted_post');

  public static UpdatedAvatar = RootEvent.createPattern('updated_avatar');

  public static UpdatedPost = RootEvent.createPattern('updated_post');

  public static UpdatedProfile = RootEvent.createPattern('updated_profile');
}

export { RootEvent as RootEvent };
