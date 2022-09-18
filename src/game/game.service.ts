import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameInput: UpdateGameInput) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
