import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './user.entity';
import { checkIfUserAlreadyExists } from 'src/helpers/checkIfUserAlreadyExists';
import { UpdateUserInput } from './dto/update-user.input';
import { FetchUsersArgs } from './dto/fetch-users.input';
import { Cart } from 'src/cart/entities/cart.entity';
import { SetMinCartValue } from 'src/cart/dto/set-min-value.input';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        public userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>
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

    async createAdminUser(data: CreateUserInput): Promise<User>{
        const errors = await checkIfUserAlreadyExists({email: data.email, cpf: data.cpf, repository: this.userRepository})

        if(errors.length > 0) throw new BadRequestException(errors)

        const user = this.userRepository.create(data)
        const adminRole = await this.roleRepository.findOne({where: {name: 'admin'}})

        user.roles = [adminRole]

        const createUser = await this.userRepository.save(user)

        if(!createUser){
            throw new InternalServerErrorException('user not created')
        }

        const userCreated = await this.userRepository.findOne({where: {id: createUser.id}, relations: {roles: true}})
        
        return userCreated
    }

    async findAllUsers(args: FetchUsersArgs): Promise<User[]>{
        const users = await this.userRepository.find({
            take: args.take || 4,
            skip: (args.skip - 1) * (args.take)|| 0,
            relations: {roles: true}
        })
        
        return users
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {email}, relations: {roles: true}})

        if(!user) throw new NotFoundException('user not found')
        return user
    }

    async getUserById(id: string): Promise<User>{
        const user = await this.userRepository.findOne({where: {id}, relations: {roles: true}})
        if(!user) throw new NotFoundException('user not found')
        return user
    }

    async findUser(email: string, userAuthenticad: User): Promise<User>{
        if(userAuthenticad.email !== email) throw new ForbiddenException('you do not have permissions to show other user')

        const user = await this.userRepository.findOne({where: {email}, relations: {roles: true}})

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

    async update(id: string, data: UpdateUserInput, authenticatedUser?: User): Promise<User>{
        // validate entrypoints
        const user = await this.getUserById(id)
        if(authenticatedUser.id !== id) throw new ForbiddenException('you do not have permissions to update other user')
        await this.checkIfExistsDuplicateUniqueField(id, data)
        // ---------------------- //

        await this.userRepository.update({id}, {...data})

        const updatedUser = this.userRepository.create({...user, ...data})

        return updatedUser
    }

    async remove(id: string, authenticatedUser?: User): Promise<boolean>{
        if(authenticatedUser.id !== id) throw new ForbiddenException('you just have permissions to delete your account')

        const user = await this.getUserById(id)
        const hasDeleted = await this.userRepository.delete(user.id)

        return hasDeleted ? true : false
    }

    async setMinCartValue(data: SetMinCartValue){
        await this.cartRepository.clear()

        const cart = this.cartRepository.create(data)

        const createdCart = await this.cartRepository.save(cart)
        return createdCart
    }

    async getMinCartValue(): Promise<Cart[]>{
        return await this.cartRepository.find()
    }
}
