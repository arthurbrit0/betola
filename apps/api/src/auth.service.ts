import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import {
  RegisterUserUseCase,
  AuthenticateUserUseCase,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  UsernameAlreadyExistsError,
  UserNotFoundError,
} from '@betola/core';
import {
  PrismaUsersRepository,
  PrismaProfilesRepository,
  BcryptHasher,
  JwtAuthenticator,
} from '@betola/adapters';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly usersRepository = new PrismaUsersRepository();
  private readonly profilesRepository = new PrismaProfilesRepository();
  private readonly hasher = new BcryptHasher();
  private readonly authenticator = new JwtAuthenticator();

  async registerUser(registerUserDto: RegisterUserDto) {
    const registerUserUseCase = new RegisterUserUseCase(
      this.usersRepository,
      this.profilesRepository,
      this.hasher,
    );

    try {
      return await registerUserUseCase.execute(registerUserDto);
    } catch (error) {
      if (
        error instanceof EmailAlreadyExistsError ||
        error instanceof UsernameAlreadyExistsError
      ) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const authenticateUserUseCase = new AuthenticateUserUseCase(
      this.usersRepository,
      this.hasher,
    );

    try {
      const { user } = await authenticateUserUseCase.execute(loginUserDto);
      const token = await this.authenticator.sign({ sub: user.id });
      return { accessToken: token };
    } catch (error) {
      if (
        error instanceof InvalidCredentialsError ||
        error instanceof UserNotFoundError
      ) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
