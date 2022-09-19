import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Game } from './entities/game.entity';
import { checkIfGameAlreadyExists } from 'src/helpers/checkIfGameAlreadyExists';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    public gameRepository: Repository<Game>
  ){}

  async create(createGameInput: CreateGameInput): Promise<Game> {
    const errors = await checkIfGameAlreadyExists({type: createGameInput.type, repository: this.gameRepository})
    if(errors.length > 0) throw new BadRequestException(errors)

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

  private async checkIfExistsDuplicateUniqueField(id: string, data: UpdateGameInput){
    if(Object.keys(data).includes('type')){
        const game = await this.gameRepository.findOneBy({type: data.type})
        if((game) && (game.id != id)) throw new BadRequestException('the type field must be unique')
    }
}

  async update(id: string, updateGameInput: UpdateGameInput): Promise<Game>{
    // validate entrypoints
    const game = await this.findOne(id)
    await this.checkIfExistsDuplicateUniqueField(id, updateGameInput)
    // ---------------------- //

    await this.gameRepository.update({id}, {...updateGameInput})

    const gameUpdated = this.gameRepository.create({...game, ...updateGameInput})

    return gameUpdated
  }

  async remove(id: string): Promise<boolean> {
    const game = await this.findOne(id)

    const hasDeleted = await this.gameRepository.delete(game.id)

    return hasDeleted ? true : false
  }
}
