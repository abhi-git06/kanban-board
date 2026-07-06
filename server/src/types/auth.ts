import { UserRole } from '@prisma/client';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  avatarUrl?: string | null;
}

export interface UpdateUserInput {
  name?: string;
  avatarUrl?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserWithoutPassword;
  tokens: TokenResponse;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshTokenInput {
  refreshToken: string;
}