import { User } from './auth';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Status = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
  order: number;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Attachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: string;
  uploadedByUser?: User;
}

export interface ActivityLog {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  details: string | null;
  createdAt: string;
  user?: User;
}

export interface Task {
  id: string;
  columnId: string;
  boardId: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  dueDate: string | null;
  order: number;
  assignedToId: string | null;
  createdById: string;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo?: User | null;
  createdBy?: User;
  updatedBy?: User | null;
  labels?: Label[];
  checklist?: ChecklistItem[];
  comments?: Comment[];
  attachments?: Attachment[];
  activityLogs?: ActivityLog[];
}

export interface CreateTaskInput {
  columnId: string;
  boardId: string;
  title: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  dueDate?: string | null;
  assignedToId?: string | null;
  labels?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  priority?: Priority;
  status?: Status;
  dueDate?: string | null;
  columnId?: string;
  assignedToId?: string | null;
  labels?: string[];
}

export interface ReorderTaskInput {
  taskId: string;
  sourceColumnId: string;
  targetColumnId: string;
  newOrder: number;
}