import { IAuthenticator } from '@betola/core';
import { sign } from 'jsonwebtoken';

export class JwtAuthenticator implements IAuthenticator {
  private readonly secret: string;

  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    this.secret = secret;
  }

  async sign(
    payload: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(payload, this.secret, options || {}, (err, token) => {
        if (err || !token) {
          return reject(err);
        }
        resolve(token);
      });
    });
  }
} 