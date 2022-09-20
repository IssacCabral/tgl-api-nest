import { CreateBetInput } from './create-bet.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBetInput extends PartialType(CreateBetInput) {
  @Field(() => Int)
  id: number;
}
