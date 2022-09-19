import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

interface createUserInput {
    email: string
    cpf: string
    repository: Repository<User>
}

export async function checkIfUserAlreadyExists({ email, cpf, repository }: createUserInput) {
    const errors = []

    if (await repository.findOne({ where: { email } })) errors.push({ message: 'email already exists' })
    if (await repository.findOne({ where: { cpf } })) errors.push({ message: 'cpf already exists' })

    return errors
} 