import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AdminResolver {
  @Query(() => String)
  public healthCheck() {
    return 'ok';
  }
}
