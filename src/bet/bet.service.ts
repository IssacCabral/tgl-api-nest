import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { Game } from 'src/game/entities/game.entity';
import { User } from 'src/user/user.entity';
import { Raw, Repository } from 'typeorm';
import { CreateBetInput } from './dto/create-bet.input';
import { UpdateBetInput } from './dto/update-bet.input';
import { Bet } from './entities/bet.entity';
import convertToRealCurrency from 'src/helpers/convert-to-real-currency';
import { FormatDate } from 'src/helpers/formatDate';

@Injectable()
export class BetService {
  constructor(
    @InjectRepository(Bet)
    private betRepository: Repository<Bet>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private userRepository: Repository<User>
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

  private async checkSumValueOfBets({bets}: CreateBetInput){
    const cart = await this.cartRepository.find()
    let minCartValue = 0

    cart.forEach(cart => minCartValue = cart.minCartValue)

    let sumValueOfBets = 0

    await Promise.all(
      bets.map(async bet => {
        const game = await this.gameRepository.findOne({where: {id: bet.gameId}})
        sumValueOfBets += game.price
      })
    )
    
    const sumValueOfBetsToReal = convertToRealCurrency.format(sumValueOfBets)
    const minCartValueToReal = convertToRealCurrency.format(minCartValue)

    if(sumValueOfBets < minCartValue) {
      throw new BadRequestException(`current cart value: ${sumValueOfBetsToReal}. the value of the bets must be at least ${minCartValueToReal}`)
    }

    return minCartValue
  }

  private async handleCreateBets({bets}: CreateBetInput, authenticatedUser: User){
    let betsCreatedAt

    await Promise.all(
      bets.map(async bet => {
        const user = await this.userRepository.findOne({where: {id: authenticatedUser.id}})
        const game = await this.gameRepository.findOne({where: {id: bet.gameId}})
        const betToCreate = new Bet()

        betToCreate.user = user
        betToCreate.game = game
        betToCreate.numbers = bet.numbers.join(',')

        await this.betRepository.save(betToCreate)

        betsCreatedAt = betToCreate.created_at
      })
    )

    return betsCreatedAt
  }

  async create(createBetInput: CreateBetInput, authenticatedUser: User): Promise<User> {
    const errors = await this.validateBetsInput(createBetInput)
    if(errors.length > 0) throw new BadRequestException(errors)

    await this.checkSumValueOfBets(createBetInput)
    const betsCreatedAt = await this.handleCreateBets(createBetInput, authenticatedUser)

    const {year, month, day, hour_minute_second} = FormatDate(betsCreatedAt.toString().split(' '))

    const user = await this.userRepository.findOne({
      relations: {
        bets: true
      },
      where: {
        bets: {
          created_at: Raw((alias) => `${alias} >= :date`, {date: `${year}-${month}-${day} ${hour_minute_second}`})
        }
      }
    })

    return user
  }

  async findAllUserBets(authenticatedUser: User) {
    const user = await this.userRepository.findOne({where: {id: authenticatedUser.id}})
    return await this.betRepository.find({relations: {user: true}, where: {user}})
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
