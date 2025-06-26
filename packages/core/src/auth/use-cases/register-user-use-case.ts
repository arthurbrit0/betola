import { User } from '../entities/user';
import { IUsersRepository } from '../repositories/users-repository';
import { IHasher } from '../services/hasher';
import { EmailAlreadyExistsError } from './errors/email-already-exists-error';
import { IProfilesRepository } from '../repositories/profiles-repository';
import { Profile } from '../entities/profile';
import { UsernameAlreadyExistsError } from './errors/username-already-exists-error';

interface RegisterUserUseCaseRequest {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterUserUseCaseResponse {
  user: User;
  profile: Profile;
}

export class RegisterUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private profilesRepository: IProfilesRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    email,
    password,
    username,
    firstName,
    lastName,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError();
    }

    const usernameAlreadyExists =
      await this.profilesRepository.findByUsername(username);

    if (usernameAlreadyExists) {
      throw new UsernameAlreadyExistsError();
    }

    const hashedPassword = await this.hasher.hash(password);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await this.usersRepository.create(user);

    const profile = new Profile({
      userId: user.id,
      username,
      firstName: firstName ?? null,
      lastName: lastName ?? null,
      avatarUrl: null,
    });

    await this.profilesRepository.create(profile);

    return {
      user,
      profile,
    };
  }
} 