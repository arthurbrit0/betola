import { IUsersRepository } from '../repositories/users-repository';
import { UserNotFoundError } from './errors/user-not-found-error';
import { randomBytes } from 'crypto';
import { IEmailSender } from '../services/email-sender';

interface RequestPasswordResetUseCaseRequest {
  email: string;
}

export class RequestPasswordResetUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private emailSender: IEmailSender,
  ) {}

  async execute({ email }: RequestPasswordResetUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const resetToken = randomBytes(32).toString('hex');
    const now = new Date();
    const expires = new Date(now.getTime() + 3600 * 1000); 

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = expires;

    await this.usersRepository.save(user);

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await this.emailSender.send(
      user.email,
      'Recuperação de Senha - Betola',
      `
        <h1>Recuperação de Senha</h1>
        <p>Você solicitou a recuperação de senha. Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este link irá expirar em 1 hora.</p>
        <p>Se você não solicitou isso, por favor, ignore este email.</p>
      `,
    );
  }
} 