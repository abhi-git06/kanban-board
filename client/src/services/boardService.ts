import api from './api';
import { Board, CreateBoardInput, UpdateBoardInput, BoardMember } from '../types/board';

const BOARDS_BASE = '/boards';

export const boardService = {
  async getBoards(): Promise<Board[]> {
    const { data } = await api.get<Board[]>(BOARDS_BASE);
    return data;
  },

  async getBoard(boardId: string): Promise<Board> {
    const { data } = await api.get<Board>(`${BOARDS_BASE}/${boardId}`);
    return data;
  },

  async createBoard(input: CreateBoardInput): Promise<Board> {
    const { data } = await api.post<Board>(BOARDS_BASE, input);
    return data;
  },

  async updateBoard(boardId: string, input: UpdateBoardInput): Promise<Board> {
    const { data } = await api.patch<Board>(`${BOARDS_BASE}/${boardId}`, input);
    return data;
  },

  async deleteBoard(boardId: string): Promise<void> {
    await api.delete(`${BOARDS_BASE}/${boardId}`);
  },

  async archiveBoard(boardId: string): Promise<Board> {
    const { data } = await api.patch<Board>(`${BOARDS_BASE}/${boardId}/archive`);
    return data;
  },

  async favouriteBoard(boardId: string, isFavourite: boolean): Promise<Board> {
    const { data } = await api.patch<Board>(`${BOARDS_BASE}/${boardId}/favourite`, { isFavourite });
    return data;
  },

  async getBoardMembers(boardId: string): Promise<BoardMember[]> {
    const { data } = await api.get<BoardMember[]>(`${BOARDS_BASE}/${boardId}/members`);
    return data;
  },

  async inviteMember(boardId: string, email: string, role: 'ADMIN' | 'MEMBER'): Promise<BoardMember> {
    const { data } = await api.post<BoardMember>(`${BOARDS_BASE}/${boardId}/members`, { email, role });
    return data;
  },

  async removeMember(boardId: string, memberId: string): Promise<void> {
    await api.delete(`${BOARDS_BASE}/${boardId}/members/${memberId}`);
  },
};