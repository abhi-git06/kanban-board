import { userRepository } from '../repositories/userRepository';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { ApiError } from '../utils/response';
import { prisma } from '../config/database';
import {
  CreateUserInput,
  LoginInput,
  AuthResponse,
  TokenResponse,
  UserWithoutPassword,
} from '../types/auth';

export const authService = {
  async register(data: CreateUserInput): Promise<AuthResponse> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError('Email already registered', 409, 'CONFLICT');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const tokens = await generateTokens(user);
    return { user, tokens };
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await userRepository.findByEmailWithPassword(data.email);
    if (!user) {
      throw new ApiError('Invalid email or password', 401, 'UNAUTHORIZED');
    }

    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) {
      throw new ApiError('Invalid email or password', 401, 'UNAUTHORIZED');
    }

    const userWithoutPassword: UserWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const tokens = await generateTokens(userWithoutPassword);
    return { user: userWithoutPassword, tokens };
  },

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  },

  async refreshToken(token: string): Promise<TokenResponse> {
    const payload = verifyRefreshToken(token);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new ApiError('Invalid or expired refresh token', 401, 'UNAUTHORIZED');
    }

    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new ApiError('User not found', 404, 'NOT_FOUND');
    }

    // Delete old refresh token
    await prisma.refreshToken.delete({
      where: { token },
    });

    return generateTokens(user);
  },

  async getMe(userId: string): Promise<UserWithoutPassword> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404, 'NOT_FOUND');
    }
    return user;
  },
};

async function generateTokens(user: UserWithoutPassword): Promise<TokenResponse> {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store refresh token with expiration
  const refreshExpires = new Date();
  refreshExpires.setDate(refreshExpires.getDate() + 7); // 7 days

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshExpires,
    },
  });

  return { accessToken, refreshToken };
}