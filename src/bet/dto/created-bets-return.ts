import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/user.entity";
import { Bet } from "../entities/bet.entity";

@ObjectType()
export class CreatedBetsReturn{
  @Field(() => User)  
  user: User

  @Field(() => String)
  betsPrice: string

  @Field(() => [Bet])
  lastBets: Bet[]
}
