import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType() // tipagem graphql
@Entity()
export class Cart{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID) // dizer ao graphQl que esse cara é um field
    id: string

    @Column({ type: 'float', width: 8 })
    minCartValue: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}