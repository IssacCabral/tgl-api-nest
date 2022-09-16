import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';

@Injectable()
export class AuthService {
    constructor(private userService: UserService){}

    async validateUser(data: AuthInput): Promise<AuthType>{
        const user = await this.userService.getUserByEmail(data.email)

        const isValidPassword = compareSync(data.password, user.password)

        if(!isValidPassword) throw new UnauthorizedException('invalid credentials')

        return {
            user,
            token: 'token'
        }
    }
}
