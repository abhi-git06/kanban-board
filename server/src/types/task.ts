import { Priority, Status } from '@prisma/client';

export interface CreateTaskInput {
  boardId: string;
  columnId: string;
  title: string;
  description?: string | null;
  priority?: Priority;
  status?: Status;
  dueDate?: Date | null;
  assignedToId?: string | null;
  labelIds?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  priority?: Priority;
  status?: Status;
  dueDate?: Date | null;
  columnId?: string;
  assignedToId?: string | null;
  labelIds?: string[];
}

export interface ReorderTaskInput {
  taskId: string;
  sourceColumnId: string;
  targetColumnId: string;
  newOrder: number;
}

export interface CreateChecklistItemInput {
  text: string;
  order?: number;
}

export interface CreateCommentInput {
  content: string;
}

export interface TaskWithRelations {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  dueDate: Date | null;
  order: number;
  assignedToId: string | null;
  createdById: string;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
  createdBy: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  updatedBy: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
  labels: {
    id: string;
    name: string;
    color: string;
  }[];
  checklist: {
    id: string;
    text: string;
    isCompleted: boolean;
    order: number;
  }[];
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
  }[];
  attachments: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
    uploadedBy: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
  }[];
  activityLogs: {
    id: string;
    action: string;
    details: string | null;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
  }[];
}