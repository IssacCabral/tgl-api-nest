import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Bet } from 'src/bet/entities/bet.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  type: string

  @Column()
  description: string

  @Column()
  range: number

  @Column({ type: 'float', width: 8 })
  price: number

  @Column()
  minAndMaxNumber: number

  @Column()
  color: string

  @OneToMany(() => Bet, (bet) => bet.game)
  bets: Bet[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

}
