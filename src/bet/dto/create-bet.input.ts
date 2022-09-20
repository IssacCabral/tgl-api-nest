import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBetInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
