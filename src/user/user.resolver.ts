import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
    constructor(
        private userService: UserService
    ){}

    @Mutation(() => User)
    async createUser(@Args('data') data: CreateUserInput): Promise<User>{
        const user = await this.userService.createUser(data)
        return user
    }

    @Query(() => [User])
    async users(): Promise<User[]>{
        const users = await this.userService.findAllUsers()
        return users
    }

    @Query(() => User)
    async userByEmail(@Args('email') email: string): Promise<User>{
       return await this.userService.getUserByEmail(email)
    }
}
