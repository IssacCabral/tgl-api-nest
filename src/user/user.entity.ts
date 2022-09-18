import { Field, HideField, ID, ObjectType } from "@nestjs/graphql";
import { hashPasswordTransform } from "src/helpers/crypto";
import { Role } from "src/role/entities/role.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType() // tipagem graphql
@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID) // dizer ao graphQl que esse cara é um field
    id: string

    @Column()
    name: string

    @Column()
    cpf: string

    @Column()
    email: string

    @Column({
        transformer: hashPasswordTransform
    })
    @HideField() // propriedade do graphQl para esconder o campo
    password: string

    @ManyToMany(() => Role)
    @JoinTable()
    roles: Role[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}