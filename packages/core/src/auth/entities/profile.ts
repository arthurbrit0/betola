import { randomUUID } from 'crypto';

export class Profile {
  id: string;
  userId: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    props: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
  ) {
    this.id = id ?? randomUUID();
    this.userId = props.userId;
    this.username = props.username;
    this.firstName = props.firstName ?? null;
    this.lastName = props.lastName ?? null;
    this.avatarUrl = props.avatarUrl ?? null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
} 