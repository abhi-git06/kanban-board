import { prisma } from '../config/database';
import { User, Prisma } from '@prisma/client';
import { CreateUserInput, UpdateUserInput, UserWithoutPassword } from '../types/auth';

const userSelectWithoutPassword: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const userRepository = {
  async findById(id: string): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelectWithoutPassword,
    });
    return user;
  },

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  },

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async create(data: CreateUserInput): Promise<UserWithoutPassword> {
    const user = await prisma.user.create({
      data,
      select: userSelectWithoutPassword,
    });
    return user;
  },

  async update(id: string, data: UpdateUserInput): Promise<UserWithoutPassword> {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: userSelectWithoutPassword,
    });
    return user;
  },

  async search(query: string): Promise<UserWithoutPassword[]> {
    return prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: userSelectWithoutPassword,
      take: 20,
    });
  },

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  },
};