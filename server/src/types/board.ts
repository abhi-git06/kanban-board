import { BoardMemberRole, Priority, Status } from '@prisma/client';

export interface CreateBoardInput {
  title: string;
  description?: string;
}

export interface UpdateBoardInput {
  title?: string;
  description?: string | null;
  isArchived?: boolean;
  isFavourite?: boolean;
}

export interface InviteMemberInput {
  email: string;
  role: BoardMemberRole;
}

export interface UpdateMemberRoleInput {
  role: BoardMemberRole;
}

export interface BoardWithRelations {
  id: string;
  title: string;
  description: string | null;
  isArchived: boolean;
  isFavourite: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  members: {
    id: string;
    userId: string;
    role: BoardMemberRole;
    joinedAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    };
  }[];
  columns: {
    id: string;
    title: string;
    order: number;
    tasks: {
      id: string;
      title: string;
      priority: Priority;
      status: Status;
      dueDate: Date | null;
      order: number;
      assignedToId: string | null;
      assignedTo: {
        id: string;
        name: string;
        avatarUrl: string | null;
      } | null;
    }[];
  }[];
}