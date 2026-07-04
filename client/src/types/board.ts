import { User } from './auth';

export interface Board {
  id: string;
  title: string;
  description: string | null;
  isArchived: boolean;
  isFavourite: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: User;
  members?: BoardMember[];
  columns?: Column[];
}

export interface BoardMember {
  id: string;
  boardId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: string;
  user?: User;
}

export interface CreateBoardInput {
  title: string;
  description?: string;
}

export interface UpdateBoardInput {
  title?: string;
  description?: string;
  isArchived?: boolean;
  isFavourite?: boolean;
}

// Forward reference — will be resolved when column.ts is generated
export interface Column {
  id: string;
  boardId: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}