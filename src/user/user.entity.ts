import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType() // tipagem graphql
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    @Field(() => ID) // dizer ao graphQl que esse cara é um field
    id: string

    @Column()
    name: string

    @Column()
    cpf: string

    @Column()
    email: string

    @Column()
    password: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}