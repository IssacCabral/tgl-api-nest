import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GameService } from './game.service';
import { Game } from './entities/game.entity';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { HttpStatus, NotFoundException, Res } from '@nestjs/common';
import { Response, response } from 'express';

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
  async findOne(@Args('id') id: string){
    return await this.gameService.findOne(id);
  }

  @Mutation(() => Game)
  async updateGame(
    @Args('id') id: string,
    @Args('updateGameInput') updateGameInput: UpdateGameInput
  ): Promise<Game> {
    return await this.gameService.update(id, updateGameInput);
  }

  @Mutation(() => Boolean)
  async removeGame(@Args('id') id: string): Promise<boolean> {
    return await this.gameService.remove(id);
  }
}
