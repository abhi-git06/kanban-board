import api from './api';
import { Column, CreateColumnInput, UpdateColumnInput, ReorderColumnInput } from '../types/column';

const COLUMNS_BASE = '/columns';

export const columnService = {
  async getColumns(boardId: string): Promise<Column[]> {
    const { data } = await api.get<Column[]>(`${COLUMNS_BASE}?boardId=${boardId}`);
    return data;
  },

  async getColumn(columnId: string): Promise<Column> {
    const { data } = await api.get<Column>(`${COLUMNS_BASE}/${columnId}`);
    return data;
  },

  async createColumn(input: CreateColumnInput): Promise<Column> {
    const { data } = await api.post<Column>(COLUMNS_BASE, input);
    return data;
  },

  async updateColumn(columnId: string, input: UpdateColumnInput): Promise<Column> {
    const { data } = await api.patch<Column>(`${COLUMNS_BASE}/${columnId}`, input);
    return data;
  },

  async deleteColumn(columnId: string): Promise<void> {
    await api.delete(`${COLUMNS_BASE}/${columnId}`);
  },

  async reorderColumns(boardId: string, reorderData: ReorderColumnInput[]): Promise<Column[]> {
    const { data } = await api.patch<Column[]>(`${COLUMNS_BASE}/reorder`, { boardId, columns: reorderData });
    return data;
  },
};