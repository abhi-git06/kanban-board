import { boardRepository } from '../repositories/boardRepository';
import { userRepository } from '../repositories/userRepository';
import { ApiError } from '../utils/response';
import {
  CreateBoardInput,
  UpdateBoardInput,
  InviteMemberInput,
  BoardWithRelations,
} from '../types/board';

export const boardService = {
  async getBoards(userId: string): Promise<BoardWithRelations[]> {
    return boardRepository.findByUserId(userId);
  },

  async getAllBoards(userId: string): Promise<BoardWithRelations[]> {
    return boardRepository.findAllByUserId(userId);
  },

  async getBoard(boardId: string, userId: string): Promise<BoardWithRelations> {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new ApiError('Board not found', 404, 'NOT_FOUND');
    }

    // Check if user has access
    const hasAccess =
      board.ownerId === userId ||
      board.members?.some((m) => m.userId === userId);

    if (!hasAccess) {
      throw new ApiError('Access denied', 403, 'FORBIDDEN');
    }

    return board;
  },

  async createBoard(data: CreateBoardInput, ownerId: string): Promise<BoardWithRelations> {
    return boardRepository.create({
      ...data,
      ownerId,
    });
  },

  async updateBoard(
    boardId: string,
    data: UpdateBoardInput,
    userId: string
  ): Promise<BoardWithRelations> {
    const board = await this.getBoard(boardId, userId);

    // Only owner and admins can update
    const memberRole = board.members?.find((m) => m.userId === userId)?.role;
    if (board.ownerId !== userId && memberRole !== 'ADMIN') {
      throw new ApiError('Only board owners and admins can update settings', 403, 'FORBIDDEN');
    }

    return boardRepository.update(boardId, data);
  },

  async deleteBoard(boardId: string, userId: string): Promise<void> {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new ApiError('Board not found', 404, 'NOT_FOUND');
    }

    if (board.ownerId !== userId) {
      throw new ApiError('Only the board owner can delete this board', 403, 'FORBIDDEN');
    }

    await boardRepository.delete(boardId);
  },

  async archiveBoard(boardId: string, userId: string): Promise<BoardWithRelations> {
    const board = await this.getBoard(boardId, userId);
    const memberRole = board.members?.find((m) => m.userId === userId)?.role;

    if (board.ownerId !== userId && memberRole !== 'ADMIN') {
      throw new ApiError('Only board owners and admins can archive', 403, 'FORBIDDEN');
    }

    return boardRepository.update(boardId, { isArchived: !board.isArchived });
  },

  async favouriteBoard(
    boardId: string,
    userId: string,
    isFavourite: boolean
  ): Promise<BoardWithRelations> {
    const board = await this.getBoard(boardId, userId);
    return boardRepository.update(boardId, { isFavourite });
  },

  async getBoardMembers(boardId: string, userId: string) {
    const board = await boardRepository.findByIdWithMembers(boardId);
    if (!board) {
      throw new ApiError('Board not found', 404, 'NOT_FOUND');
    }

    const hasAccess =
      board.ownerId === userId || board.members?.some((m) => m.userId === userId);

    if (!hasAccess) {
      throw new ApiError('Access denied', 403, 'FORBIDDEN');
    }

    return board.members;
  },

  async inviteMember(
    boardId: string,
    userId: string,
    data: InviteMemberInput
  ) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new ApiError('Board not found', 404, 'NOT_FOUND');
    }

    // Only owner and admins can invite
    const memberRole = board.members?.find((m) => m.userId === userId)?.role;
    if (board.ownerId !== userId && memberRole !== 'ADMIN') {
      throw new ApiError('Only board owners and admins can invite members', 403, 'FORBIDDEN');
    }

    // Check if user exists
    const invitee = await userRepository.findByEmail(data.email);
    if (!invitee) {
      throw new ApiError('User with this email not found', 404, 'NOT_FOUND');
    }

    // Check if already a member
    const existingMember = await boardRepository.findMemberByBoardAndUser(boardId, invitee.id);
    if (existingMember) {
      throw new ApiError('User is already a member of this board', 409, 'CONFLICT');
    }

    return boardRepository.addMember(boardId, invitee.id, data.role);
  },

  async removeMember(boardId: string, memberId: string, userId: string): Promise<void> {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new ApiError('Board not found', 404, 'NOT_FOUND');
    }

    // Only owner and admins can remove members
    const memberRole = board.members?.find((m) => m.userId === userId)?.role;
    if (board.ownerId !== userId && memberRole !== 'ADMIN') {
      throw new ApiError('Only board owners and admins can remove members', 403, 'FORBIDDEN');
    }

    // Cannot remove owner
    const targetMember = await boardRepository.findMemberById(memberId);
    if (!targetMember || targetMember.boardId !== boardId) {
      throw new ApiError('Member not found', 404, 'NOT_FOUND');
    }

    if (targetMember.role === 'OWNER') {
      throw new ApiError('Cannot remove the board owner', 403, 'FORBIDDEN');
    }

    await boardRepository.removeMember(memberId);
  },
};