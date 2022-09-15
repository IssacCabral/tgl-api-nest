import { InputType } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator"

@InputType()
export class CreateUserInput {
    @IsString()
    @IsNotEmpty({ message: 'name can not be empty' })
    name: string

    @IsString()
    @IsNotEmpty({ message: 'cpf can not be empty' })
    cpf: string

    @IsEmail()
    @IsNotEmpty({ message: 'email can not be empty' })
    email: string

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    password: string;
}