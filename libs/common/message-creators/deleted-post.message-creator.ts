// export type DeletedPostType = {
//   id: string;
// };

import { IsNumber, IsString } from 'class-validator';

export interface DeletedPostType {
  id: string;
}

export class DeletedPostType {
  @IsNumber()
  // @IsString()
  public id: string;
}

export const deletedPostMessageCreator = (id: string) => ({
  id,
});
