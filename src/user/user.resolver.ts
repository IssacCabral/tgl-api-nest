import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/role/decorator/roles.decorator';
import { RoleEnum } from 'src/role/enums/role.enum';
import { RolesGuard } from 'src/role/guards/roles.guard';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
    constructor(
        private userService: UserService
    ) { }

    @Mutation(() => User)
    async createUser(@Args('data') data: CreateUserInput): Promise<User> {
        const user = await this.userService.createUser(data)
        return user
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        const users = await this.userService.findAllUsers()
        return users
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(RoleEnum.Player)
    @Query(() => User)
    async userByEmail(@Args('email') email: string): Promise<User> {
        return await this.userService.getUserByEmail(email)
    }

    @Mutation(() => User)
    async updateUser(
        @Args('id') id: string,
        @Args('updateUserInput') updateUserInput: UpdateUserInput
    ): Promise<User> {
        return await this.userService.update(id, updateUserInput);
    }

    @Mutation(() => Boolean)
    async removeUser(@Args('id') id: string): Promise<boolean> {
        return await this.userService.remove(id);
    }
}
