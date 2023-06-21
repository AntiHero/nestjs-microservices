const patternIssuer = 'root';

const createPattern = (message: string): string =>
  `${patternIssuer}:${message}`;

class RootEvent {
  public static ConfirmedEmail: string = createPattern('confirmed_email');
  public static CreatedPost: string = createPattern('created_post');
  public static CreatedUser: string = createPattern('created_user');
  public static DeletedPost: string = createPattern('deleted_post');
  public static UpdatedAvatar: string = createPattern('updated_avatar');
  public static UpdatedPost: string = createPattern('updated_post');
  public static UpdatedProfile: string = createPattern('updated_profile');
}

export { RootEvent as RootEvent };
