import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';

@Resolver()
export class AuthResolver {
    constructor(
        private authService: AuthService
    ){}

    @Mutation(() => AuthType)
    async login(@Args('data') data: AuthInput): Promise<AuthType>{
        return await this.authService.validateUser(data)
    }   


}
