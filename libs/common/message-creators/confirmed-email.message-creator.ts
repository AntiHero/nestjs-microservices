export type ConfirmedEmailtype = {
  userId: string;
  emailConfirmed: boolean;
};

export const confirmedEmailMessageCreator = (
  data: ConfirmedEmailtype,
): ConfirmedEmailtype => data;
