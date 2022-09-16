import { InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class AuthInput{
    @IsEmail()
    @IsNotEmpty({ message: 'email can not be empty' })
    email: string

    @IsString()
    password: string;
}