import { IUsersRepository, User } from '@betola/core';
import { PrismaClient } from '@prisma/client';
import { prisma } from './prisma';

export class PrismaUsersRepository implements IUsersRepository {
  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return new User(
      {
        email: user.email,
        password: user.password,
      },
      user.id,
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return new User(
      {
        email: user.email,
        password: user.password,
        passwordResetToken: user.passwordResetToken,
        passwordResetExpires: user.passwordResetExpires,
      },
      user.id,
    );
  }

  async save(user: User): Promise<void> {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: user.email,
        password: user.password,
        passwordResetToken: user.passwordResetToken,
        passwordResetExpires: user.passwordResetExpires,
        updatedAt: new Date(),
      },
    });
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
      },
    });

    if (!user) {
      return null;
    }

    return new User(
      {
        email: user.email,
        password: user.password,
        passwordResetToken: user.passwordResetToken,
        passwordResetExpires: user.passwordResetExpires,
      },
      user.id,
    );
  }
} 