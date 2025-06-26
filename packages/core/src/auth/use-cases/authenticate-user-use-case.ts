import { User } from '../entities/user';
import { IUsersRepository } from '../repositories/users-repository';
import { IHasher } from '../services/hasher';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

export interface AuthenticateUserUseCaseResponse {
  user: User;
}

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatch = await this.hasher.compare(password, user.password);

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
} 