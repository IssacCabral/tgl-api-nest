import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/role/decorator/roles.decorator';
import { RoleEnum } from 'src/role/enums/role.enum';
import { RolesGuard } from 'src/role/guards/roles.guard';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from './decorator/user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';
import { FetchUsersArgs } from './dto/fetch-users.input';
import { Cart } from 'src/cart/entities/cart.entity';
import { SetMinCartValue } from 'src/cart/dto/set-min-value.input';

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

    @Mutation(() => User)
    async createAdminUser(@Args('data') data: CreateUserInput): Promise<User> {
        const user = await this.userService.createAdminUser(data)
        return user
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Query(() => [User])
    async users(@Args() args: FetchUsersArgs): Promise<User[]> {
        const users = await this.userService.findAllUsers(args)
        return users
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(RoleEnum.Player)
    @Query(() => User)
    async findUser(
        @Args('email') email: string,
        @CurrentUser() authenticatedUser: User
    ): Promise<User> {
        return await this.userService.findUser(email, authenticatedUser)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => User)
    async updateUser(
        @Args('id') id: string,
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
        @CurrentUser() authenticatedUser: User
    ): Promise<User> {
        return await this.userService.update(id, updateUserInput, authenticatedUser);
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(RoleEnum.Player)
    @Mutation(() => Boolean)
    async removeUser(
        @Args('id') id: string,
        @CurrentUser() authenticatedUser: User
    ): Promise<boolean> {
        return await this.userService.remove(id, authenticatedUser);
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Mutation(() => Cart)
    async setMinCartValue(
        @Args('data') data: SetMinCartValue
    ): Promise<Cart> {
        return await this.userService.setMinCartValue(data)
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Query(() => [Cart])
    async getMinCartValue(): Promise<Cart[]> {
        return await this.userService.getMinCartValue()
    }
}
