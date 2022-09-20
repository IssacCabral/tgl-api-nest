import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GameService } from './game.service';
import { Game } from './entities/game.entity';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { FetchGamesArgs } from './dto/fetch-games.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/role/guards/roles.guard';
import { Roles } from 'src/role/decorator/roles.decorator';
import { RoleEnum } from 'src/role/enums/role.enum';

@Resolver(() => Game)
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @Mutation(() => Game)
  createGame(@Args('createGameInput') createGameInput: CreateGameInput) {
    return this.gameService.create(createGameInput);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @Query(() => [Game])
  async games(@Args() args: FetchGamesArgs): Promise<Game[]> {
    return this.gameService.findAll(args);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @Query(() => Game, { name: 'gameById' })
  async findOne(@Args('id') id: string){
    return await this.gameService.findOne(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @Mutation(() => Game)
  async updateGame(
    @Args('id') id: string,
    @Args('updateGameInput') updateGameInput: UpdateGameInput
  ): Promise<Game> {
    return await this.gameService.update(id, updateGameInput);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @Mutation(() => Boolean)
  async removeGame(@Args('id') id: string): Promise<boolean> {
    return await this.gameService.remove(id);
  }
}
