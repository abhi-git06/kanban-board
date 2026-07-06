export interface CreateColumnInput {
  boardId: string;
  title: string;
}

export interface UpdateColumnInput {
  title?: string;
  order?: number;
}

export interface ReorderColumnInput {
  columnId: number;
  newOrder: number;
}

export interface ColumnWithTasks {
  id: number;
  boardId: string;
  title: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  tasks: {
    id: string;
    title: string;
    description: string | null;
    priority: string;
    status: string;
    dueDate: Date | null;
    order: number;
    assignedToId: string | null;
    assignedTo: {
      id: string;
      name: string;
      avatarUrl: string | null;
    } | null;
  }[];
}