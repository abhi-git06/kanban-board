import { Task } from './task';

export interface Column {
  id: string;
  boardId: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

export interface CreateColumnInput {
  boardId: string;
  title: string;
}

export interface UpdateColumnInput {
  title?: string;
  order?: number;
}

export interface ReorderColumnInput {
  columnId: string;
  newOrder: number;
}