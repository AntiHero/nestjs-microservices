import { InputType }       from '@nestjs/graphql';

import { DeleteUserInput } from './delete-user.input';

@InputType()
export class UnBanUserInput extends DeleteUserInput {}
