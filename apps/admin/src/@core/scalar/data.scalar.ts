import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<number, Date> {
  public description = 'Date custom scalar type';

  public parseValue(value: unknown): Date {
    return new Date(value as number);
  }

  public serialize(value: unknown): number {
    return (value as Date).getTime();
  }

  public parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return new Date();
  }
}
