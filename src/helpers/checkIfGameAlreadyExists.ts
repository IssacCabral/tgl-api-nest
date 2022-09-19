import { Game } from 'src/game/entities/game.entity';
import { Repository } from 'typeorm';

interface createUserInput {
    type: string
    repository: Repository<Game>
}

export async function checkIfGameAlreadyExists({ type, repository }: createUserInput) {
    const errors = []

    if (await repository.findOne({ where: { type } })) errors.push({ message: 'type already exists' })
    return errors
} 