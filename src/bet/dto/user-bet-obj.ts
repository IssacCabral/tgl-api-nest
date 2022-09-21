import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/user.entity";
import { Bet } from "../entities/bet.entity";

@ObjectType()
export class UserBetsObj{
  @Field(() => User)  
  user: User
  @Field(() => [Bet])
  bets: Bet[]
}
