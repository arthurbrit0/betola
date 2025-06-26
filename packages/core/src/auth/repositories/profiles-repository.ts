import { Profile } from '../entities/profile';

export interface IProfilesRepository {
  create(profile: Profile): Promise<void>;
  findByUserId(userId: string): Promise<Profile | null>;
  findByUsername(username: string): Promise<Profile | null>;
  save(profile: Profile): Promise<void>;
} 