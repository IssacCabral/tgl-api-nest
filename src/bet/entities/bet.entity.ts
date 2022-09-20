import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Game } from 'src/game/entities/game.entity';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Bet {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => User, (user) => user.bets)
  user: User

  @ManyToOne(() => Game, (game) => game.bets)
  game: Game

  @Column()
  numbers: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
  
}
