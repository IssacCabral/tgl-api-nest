import { InputType, ObjectType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
class BetInput{
  @IsString()
  gameId: string

  @IsArray()
  numbers: number[]
}

@InputType()
export class CreateBetInput {

  @IsArray()
  bets: BetInput[]
}

