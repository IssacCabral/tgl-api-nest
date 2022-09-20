import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

@InputType()
class BetInput{
  @IsString()
  gameId: string

  @Field(() => [Number])
  @IsArray()
  numbers: number[]
}

@InputType()
export class CreateBetInput {

  @Field(() => [BetInput])
  @ValidateNested({each: true})
  @Type(() => BetInput)
  @IsArray()
  bets: BetInput[]
}

