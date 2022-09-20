import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BetService } from './bet.service';
import { Bet } from './entities/bet.entity';
import { CreateBetInput } from './dto/create-bet.input';
import { UpdateBetInput } from './dto/update-bet.input';

@Resolver(() => Bet)
export class BetResolver {
  constructor(private readonly betService: BetService) {}

  @Mutation(() => Bet)
  createBet(@Args('createBetInput') createBetInput: CreateBetInput) {
    return this.betService.create(createBetInput);
  }

  @Query(() => [Bet], { name: 'bet' })
  findAll() {
    return this.betService.findAll();
  }

  @Query(() => Bet, { name: 'bet' })
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
