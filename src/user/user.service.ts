import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './user.entity';
import { checkIfUserAlreadyExists } from 'src/helpers/checkIfUserAlreadyExists';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        public userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ){}

    async createUser(data: CreateUserInput): Promise<User>{
        const errors = await checkIfUserAlreadyExists({email: data.email, cpf: data.cpf, repository: this.userRepository})

        if(errors.length > 0) throw new BadRequestException(errors)

        const user = this.userRepository.create(data)
        const playerRole = await this.roleRepository.findOne({where: {name: 'player'}})

        user.roles = [playerRole]

        const createUser = await this.userRepository.save(user)

        if(!createUser){
            throw new InternalServerErrorException('user not created')
        }

        const userCreated = await this.userRepository.findOne({where: {id: createUser.id}, relations: {roles: true}})
        
        return userCreated
    }

    async findAllUsers(): Promise<User[]>{
        const users = await this.userRepository.find()
        return users
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {email}})

        if(!user) throw new NotFoundException('user not found')

        return user
    }
}
