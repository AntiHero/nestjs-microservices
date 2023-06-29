export type ConfirmedEmailtype = {
  userId: string;
  isEmailConfirmed: boolean;
};

export const confirmedEmailMessageCreator = (
  data: ConfirmedEmailtype,
): ConfirmedEmailtype => data;
