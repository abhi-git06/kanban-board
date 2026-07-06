import { UserRole } from './auth';

export interface UserSearchResult {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export interface UserBoardSummary {
  id: string;
  title: string;
  role: UserRole | 'OWNER';
  isArchived: boolean;
  isFavourite: boolean;
}

export interface UserProfileUpdate {
  name?: string;
  avatarUrl?: string | null;
}