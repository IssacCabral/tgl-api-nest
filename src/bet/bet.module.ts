import { Module } from '@nestjs/common';
import { BetService } from './bet.service';
import { BetResolver } from './bet.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from './entities/bet.entity';
import { Game } from 'src/game/entities/game.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bet, Game, Cart, User])
  ],
  providers: [BetResolver, BetService]
})
export class BetModule {}
