import { BadRequestException, Injectable, NotFoundException, Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidateNested } from 'class-validator';
import { Game } from 'src/game/entities/game.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateBetInput } from './dto/create-bet.input';
import { UpdateBetInput } from './dto/update-bet.input';
import { Bet } from './entities/bet.entity';

@Injectable()
export class BetService {
  constructor(
    @InjectRepository(Bet)
    private betRepository: Repository<Bet>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>
  ) {}

  private async validateBetsInput({bets}: CreateBetInput){
    let errors = []

    await Promise.all(
      bets.map(async bet => {
        const gameExists = await this.gameRepository.findOneBy({id: bet.gameId})
  
        if(!gameExists){
          errors.push({message: `game id: ${bet.gameId} is not found`})
        }

        if(gameExists){
          if(gameExists.minAndMaxNumber !== bet.numbers.length){
            errors.push({message: `the game ${gameExists.type} needs exactly ${gameExists.minAndMaxNumber} numbers to be bet`})
          }

          if(bet.numbers.some(number => number > gameExists.range)) {
            errors.push({message: `the ${gameExists.type} game has a range of ${gameExists.range}. You cannot bet numbers higher than this amount.`})
          }
        }
        
      })
    )
    
    return errors
  }

  async create(createBetInput: CreateBetInput, authenticatedUser: User): Promise<User> {
    const errors = await this.validateBetsInput(createBetInput)
    if(errors.length > 0) throw new BadRequestException(errors)

    

    return authenticatedUser
  }

  findAll() {
    return `This action returns all bet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bet`;
  }

  update(id: number, updateBetInput: UpdateBetInput) {
    return `This action updates a #${id} bet`;
  }

  remove(id: number) {
    return `This action removes a #${id} bet`;
  }
}
