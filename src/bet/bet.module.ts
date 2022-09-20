import { Module } from '@nestjs/common';
import { BetService } from './bet.service';
import { BetResolver } from './bet.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from './entities/bet.entity';
import { Game } from 'src/game/entities/game.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bet, Game])
  ],
  providers: [BetResolver, BetService]
})
export class BetModule {}
