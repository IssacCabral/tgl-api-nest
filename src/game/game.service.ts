import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>
  ){}

  async create(createGameInput: CreateGameInput): Promise<Game> {
    const game = this.gameRepository.create(createGameInput)
    const gameCreated = await this.gameRepository.save(game)

    if(!gameCreated) throw new InternalServerErrorException('game not created')

    return gameCreated
  }

  async findAll(): Promise<Game[]> {
    return await this.gameRepository.find()
  }

  async findOne(id: string): Promise<Game> {
    const game = await this.gameRepository.findOne({where: {id: id}})

    if(!game) throw new NotFoundException('game not found')

    return game
  }

  async update(id: string, updateGameInput: UpdateGameInput): Promise<Game>{
    const game = await this.findOne(id)

    await this.gameRepository.update({id}, {...updateGameInput})

    const gameUpdated = this.gameRepository.create({...game, ...updateGameInput})

    return gameUpdated
  }

  async remove(id: string): Promise<boolean> {
    const game = await this.findOne(id)

    const deleted = await this.gameRepository.delete(game)

    return deleted ? true : false
  }
}
