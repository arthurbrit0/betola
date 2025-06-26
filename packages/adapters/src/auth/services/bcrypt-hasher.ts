import { IHasher } from '@betola/core';
import { compare, hash } from 'bcrypt';

export class BcryptHasher implements IHasher {
  private SALT_ROUNDS = 8;

  async hash(plain: string): Promise<string> {
    return hash(plain, this.SALT_ROUNDS);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
} 