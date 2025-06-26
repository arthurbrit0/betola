import { IUsersRepository } from '../repositories/users-repository';
import { IHasher } from '../services/hasher';
import { InvalidResetTokenError } from './errors/invalid-reset-token-error';

interface ResetPasswordUseCaseRequest {
  token: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    token,
    newPassword,
  }: ResetPasswordUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findByPasswordResetToken(token);

    if (!user || !user.passwordResetExpires) {
      throw new InvalidResetTokenError();
    }

    const now = new Date();
    if (now > user.passwordResetExpires) {
      throw new InvalidResetTokenError();
    }

    const hashedPassword = await this.hasher.hash(newPassword);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await this.usersRepository.save(user);
  }
} 