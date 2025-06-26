import { IProfilesRepository } from '../repositories/profiles-repository';
import { Profile } from '../entities/profile';
import { UserNotFoundError } from './errors/user-not-found-error';
import { UsernameAlreadyExistsError } from './errors/username-already-exists-error';

interface UpdateProfileUseCaseRequest {
  userId: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
}

interface UpdateProfileUseCaseResponse {
  profile: Profile;
}

export class UpdateProfileUseCase {
  constructor(private profilesRepository: IProfilesRepository) {}

  async execute({
    userId,
    username,
    firstName,
    lastName,
    avatarUrl,
  }: UpdateProfileUseCaseRequest): Promise<UpdateProfileUseCaseResponse> {
    const profile = await this.profilesRepository.findByUserId(userId);

    if (!profile) {
      throw new UserNotFoundError();
    }

    if (username && username !== profile.username) {
      const existing = await this.profilesRepository.findByUsername(username);
      if (existing) {
        throw new UsernameAlreadyExistsError();
      }
      profile.username = username;
    }

    if (firstName !== undefined) profile.firstName = firstName;
    if (lastName !== undefined) profile.lastName = lastName;
    if (avatarUrl !== undefined) profile.avatarUrl = avatarUrl;

    await this.profilesRepository.save(profile);

    return { profile };
  }
} 