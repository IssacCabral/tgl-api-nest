import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './user.entity';
import { checkIfUserAlreadyExists } from 'src/helpers/checkIfUserAlreadyExists';
import { UpdateUserInput } from './dto/update-user.input';

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
        const users = await this.userRepository.find({relations: {roles: true}})
        return users
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {email}, relations: {roles: true}})

        if(!user) throw new NotFoundException('user not found')

        return user
    }

    private async getUserById(id: string): Promise<User>{
        const user = await this.userRepository.findOne({where: {id}})
        if(!user) throw new NotFoundException('user not found')
        return user
    }

    private async checkIfExistsDuplicateUniqueField(id: string, data: UpdateUserInput){
        if(Object.keys(data).includes('cpf')){
            const user = await this.userRepository.findOneBy({cpf: data.cpf})
            if((user) && (user.id != id)) throw new BadRequestException('the cpf must be unique')
        }
        if(Object.keys(data).includes('email')){
            const user = await this.userRepository.findOneBy({email: data.email})
            if((user) && (user.id != id)) throw new BadRequestException('the email must be unique')
        }
    }

    async update(id: string, data: UpdateUserInput): Promise<User>{
        // validate entrypoints
        const user = await this.getUserById(id)
        await this.checkIfExistsDuplicateUniqueField(id, data)
        // ---------------------- //

        await this.userRepository.update({id}, {...data})

        const updatedUser = this.userRepository.create({...user, ...data})

        return updatedUser
    }

    async remove(id: string): Promise<boolean>{
        const user = await this.getUserById(id)
        const hasDeleted = await this.userRepository.delete(user.id)

        return hasDeleted ? true : false
    }
}
