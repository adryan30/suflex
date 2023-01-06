import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetProductArgs {
  @Field(() => Boolean, { nullable: true })
  alphabetical?: boolean;

  @Field(() => Int, { nullable: true })
  days_to_expire: number;
}
