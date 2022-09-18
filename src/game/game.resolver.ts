import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GameService } from './game.service';
import { Game } from './entities/game.entity';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';

@Resolver(() => Game)
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Mutation(() => Game)
  createGame(@Args('createGameInput') createGameInput: CreateGameInput) {
    return this.gameService.create(createGameInput);
  }

  @Query(() => [Game])
  async games(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Query(() => Game, { name: 'gameById' })
  findOne(@Args('id') id: string): Promise<Game> {
    return this.gameService.findOne(id);
  }

  @Mutation(() => Game)
  async updateGame(
    @Args('id') id: string,
    @Args('updateGameInput') updateGameInput: UpdateGameInput
  ): Promise<Game> {
    return await this.gameService.update(id, updateGameInput);
  }

  @Mutation(() => Game)
  removeGame(@Args('id') id: string) {
    return this.gameService.remove(id);
  }
}
