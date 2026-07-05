import api from './api';
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  ReorderTaskInput,
  Comment,
  Attachment,
  ActivityLog,
  ChecklistItem,
} from '../types/task';

const TASKS_BASE = '/tasks';

export const taskService = {
  async getTasks(boardId: string): Promise<Task[]> {
    const { data } = await api.get<Task[]>(`${TASKS_BASE}?boardId=${boardId}`);
    return data;
  },

  async getTask(taskId: string): Promise<Task> {
    const { data } = await api.get<Task>(`${TASKS_BASE}/${taskId}`);
    return data;
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    const { data } = await api.post<Task>(TASKS_BASE, input);
    return data;
  },

  async updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
    const { data } = await api.patch<Task>(`${TASKS_BASE}/${taskId}`, input);
    return data;
  },

  async deleteTask(taskId: string): Promise<void> {
    await api.delete(`${TASKS_BASE}/${taskId}`);
  },

  async reorderTask(input: ReorderTaskInput): Promise<Task> {
    const { data } = await api.patch<Task>(`${TASKS_BASE}/reorder`, input);
    return data;
  },

  // Labels
  async addLabel(taskId: string, labelId: string): Promise<Task> {
    const { data } = await api.post<Task>(`${TASKS_BASE}/${taskId}/labels`, { labelId });
    return data;
  },

  async removeLabel(taskId: string, labelId: string): Promise<Task> {
    await api.delete(`${TASKS_BASE}/${taskId}/labels/${labelId}`);
    return data;
  },

  // Checklist
  async addChecklistItem(taskId: string, item: Omit<ChecklistItem, 'id'>): Promise<Task> {
    const { data } = await api.post<Task>(`${TASKS_BASE}/${taskId}/checklist`, item);
    return data;
  },

  async toggleChecklistItem(taskId: string, itemId: string): Promise<Task> {
    const { data } = await api.patch<Task>(`${TASKS_BASE}/${taskId}/checklist/${itemId}/toggle`);
    return data;
  },

  async deleteChecklistItem(taskId: string, itemId: string): Promise<Task> {
    const { data } = await api.delete<Task>(`${TASKS_BASE}/${taskId}/checklist/${itemId}`);
    return data;
  },

  // Comments
  async getComments(taskId: string): Promise<Comment[]> {
    const { data } = await api.get<Comment[]>(`${TASKS_BASE}/${taskId}/comments`);
    return data;
  },

  async addComment(taskId: string, content: string): Promise<Comment> {
    const { data } = await api.post<Comment>(`${TASKS_BASE}/${taskId}/comments`, { content });
    return data;
  },

  async deleteComment(taskId: string, commentId: string): Promise<void> {
    await api.delete(`${TASKS_BASE}/${taskId}/comments/${commentId}`);
  },

  // Attachments
  async getAttachments(taskId: string): Promise<Attachment[]> {
    const { data } = await api.get<Attachment[]>(`${TASKS_BASE}/${taskId}/attachments`);
    return data;
  },

  async uploadAttachment(taskId: string, file: File): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<Attachment>(`${TASKS_BASE}/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async deleteAttachment(taskId: string, attachmentId: string): Promise<void> {
    await api.delete(`${TASKS_BASE}/${taskId}/attachments/${attachmentId}`);
  },

  // Activity Log
  async getActivityLogs(taskId: string): Promise<ActivityLog[]> {
    const { data } = await api.get<ActivityLog[]>(`${TASKS_BASE}/${taskId}/activity`);
    return data;
  },
};