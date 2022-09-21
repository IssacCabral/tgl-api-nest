import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BetService } from './bet.service';
import { Bet } from './entities/bet.entity';
import { CreateBetInput } from './dto/create-bet.input';
import { UpdateBetInput } from './dto/update-bet.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/role/guards/roles.guard';
import { Roles } from 'src/role/decorator/roles.decorator';
import { RoleEnum } from 'src/role/enums/role.enum';
import { CurrentUser } from 'src/user/decorator/user.decorator';
import { User } from 'src/user/user.entity';

import { UserBetsObj } from './dto/user-bet-obj';
import { CreatedBetsReturn } from './dto/created-bets-return';
import { FetchBetsInput } from './dto/fetch-bets-input';

@Resolver(() => Bet)
export class BetResolver {
  constructor(private readonly betService: BetService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(RoleEnum.Player)
  @Mutation(() => CreatedBetsReturn)
  async createBets(
    @Args('createBetInput') createBetInput: CreateBetInput,
    @CurrentUser() authenticatedUser: User
  ): Promise<CreatedBetsReturn> {
    return await this.betService.create(createBetInput, authenticatedUser);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(RoleEnum.Player)
  @Query(() => UserBetsObj)
  async findAllUserBets(@CurrentUser() authenticatedUser: User): Promise<UserBetsObj> {
    return await this.betService.findAllUserBets(authenticatedUser);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @Query(() => [Bet])
  async findAllBets(
    @Args() args: FetchBetsInput
  ){
    return await this.betService.findAllBets(args)
  }

  @Query(() => Bet)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.betService.findOne(id);
  }


}
