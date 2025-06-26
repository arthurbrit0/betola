import { randomUUID } from 'crypto';

export class User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;

  constructor(
    props: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
  ) {
    this.id = id ?? randomUUID();
    this.email = props.email;
    this.password = props.password;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.passwordResetToken = props.passwordResetToken;
    this.passwordResetExpires = props.passwordResetExpires;
  }
} 