import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';
import { UserPayload } from './models/UserPayload';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService){}

    async validateUser(data: AuthInput): Promise<AuthType>{
        const user = await this.userService.getUserByEmail(data.email)

        const isValidPassword = compareSync(data.password, user.password)

        if(!isValidPassword) throw new UnauthorizedException('invalid credentials')

        const token = await this.jwtToken(user)

        return {user, token}
    }

    private async jwtToken(user: User): Promise<string>{
        const payload: UserPayload = {
            sub: user.id,
            name: user.name,
            email: user.email
        }
        return await this.jwtService.signAsync(payload)
    }
}
