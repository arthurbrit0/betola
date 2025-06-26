import { Profile } from '../entities/profile';
import { IProfilesRepository } from '../repositories/profiles-repository';
import { UserNotFoundError } from './errors/user-not-found-error';

interface GetProfileUseCaseResponse {
  profile: Profile;
}

export class GetProfileUseCase {
  constructor(private profilesRepository: IProfilesRepository) {}

  async execute(userId: string): Promise<GetProfileUseCaseResponse> {
    const profile = await this.profilesRepository.findByUserId(userId);

    if (!profile) {
      throw new UserNotFoundError();
    }

    return { profile };
  }
} 