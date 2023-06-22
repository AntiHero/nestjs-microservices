export type DeletedPostType = {
  id: string;
};

export const deletedPostMessageCreator = (id: string) => ({
  id,
});
