import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    async createUser(data: CreateUserInput): Promise<User>{
        const user = this.userRepository.create(data)
        const userCreated = await this.userRepository.save(user)

        if(!userCreated){
            throw new InternalServerErrorException('user not created')
        }
        return {
            ...userCreated,
            password: undefined
        }
    }

    async findAllUsers(): Promise<User[]>{
        const users = await this.userRepository.find()
        return users
    }
}
