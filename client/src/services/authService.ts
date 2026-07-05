import api from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';

const AUTH_BASE = '/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(`${AUTH_BASE}/login`, credentials);
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(`${AUTH_BASE}/register`, credentials);
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    return data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    await api.post(`${AUTH_BASE}/logout`, { refreshToken });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>(`${AUTH_BASE}/me`);
    return data;
  },

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await api.post<AuthTokens>(`${AUTH_BASE}/refresh`, { refreshToken });
    localStorage.setItem('accessToken', data.accessToken);
    return data;
  },
};

// Re-export for convenience
import { AuthTokens } from '../types/auth';