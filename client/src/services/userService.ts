import api from './api';
import { User } from '../types/auth';

const USERS_BASE = '/users';

export const userService = {
  async searchUsers(query: string): Promise<User[]> {
    const { data } = await api.get<User[]>(`${USERS_BASE}/search`, {
      params: { q: query },
    });
    return data;
  },

  async getUserById(userId: string): Promise<User> {
    const { data } = await api.get<User>(`${USERS_BASE}/${userId}`);
    return data;
  },

  async updateProfile(name: string, avatarUrl?: string): Promise<User> {
    const { data } = await api.patch<User>(`${USERS_BASE}/profile`, { name, avatarUrl });
    return data;
  },

  async getCurrentUserBoards(): Promise<{ id: string; title: string; role: string }[]> {
    const { data } = await api.get<{ id: string; title: string; role: string }[]>(`${USERS_BASE}/boards`);
    return data;
  },
};