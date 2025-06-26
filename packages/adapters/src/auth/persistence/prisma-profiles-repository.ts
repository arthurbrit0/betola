import { IProfilesRepository, Profile } from '@betola/core';
import { PrismaClient } from '@prisma/client';
import { prisma } from './prisma';

export class PrismaProfilesRepository implements IProfilesRepository {
  async create(profile: Profile): Promise<void> {
    await prisma.profile.create({
      data: {
        id: profile.id,
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        userId: profile.userId,
      },
    });
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const profile = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    if (!profile) {
      return null;
    }

    return new Profile(
      {
        userId: profile.userId,
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl,
      },
      profile.id,
    );
  }

  async findByUsername(username: string): Promise<Profile | null> {
    const profile = await prisma.profile.findUnique({
      where: {
        username,
      },
    });

    if (!profile) {
      return null;
    }

    return new Profile(
      {
        userId: profile.userId,
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl,
      },
      profile.id,
    );
  }

  async save(profile: Profile): Promise<void> {
    await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl,
        updatedAt: new Date(),
      },
    });
  }
} 