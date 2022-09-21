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

@Resolver(() => Bet)
export class BetResolver {
  constructor(private readonly betService: BetService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(RoleEnum.Player)
  @Mutation(() => User)
  async createBets(
    @Args('createBetInput') createBetInput: CreateBetInput,
    @CurrentUser() authenticatedUser: User
  ): Promise<User> {
    return await this.betService.create(createBetInput, authenticatedUser);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(RoleEnum.Player)
  @Query(() => [Bet])
  findAllUserBets(@CurrentUser() authenticatedUser: User) {
    return this.betService.findAllUserBets(authenticatedUser);
  }

  @Query(() => Bet)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.betService.findOne(id);
  }

  @Mutation(() => Bet)
  updateBet(@Args('updateBetInput') updateBetInput: UpdateBetInput) {
    return this.betService.update(updateBetInput.id, updateBetInput);
  }

  @Mutation(() => Bet)
  removeBet(@Args('id', { type: () => Int }) id: number) {
    return this.betService.remove(id);
  }
}
