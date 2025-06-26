import { User } from '../entities/user';

export interface IUsersRepository {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByPasswordResetToken(token: string): Promise<User | null>;
  save(user: User): Promise<void>;
} 