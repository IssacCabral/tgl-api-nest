import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcrypt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';
import { UserPayload } from './models/UserPayload';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService
    ){}

    async validateUser(data: AuthInput): Promise<AuthType>{
        const user = await this.userRepository.findOne({where: {email: data.email}, relations: {roles: true}})
        if(!user) throw new UnauthorizedException('invalid credentials')
        
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
