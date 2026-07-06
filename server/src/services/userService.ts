import { userRepository } from '../repositories/userRepository';
import { boardRepository } from '../repositories/boardRepository';
import { ApiError } from '../utils/response';
import { UpdateUserInput, UserWithoutPassword } from '../types/auth';

export const userService = {
  async getUserById(userId: string): Promise<UserWithoutPassword> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404, 'NOT_FOUND');
    }
    return user;
  },

  async updateProfile(userId: string, data: UpdateUserInput): Promise<UserWithoutPassword> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404, 'NOT_FOUND');
    }

    return userRepository.update(userId, data);
  },

  async searchUsers(query: string, requesterId: string): Promise<UserWithoutPassword[]> {
    if (!query || query.trim().length < 2) {
      throw new ApiError('Search query must be at least 2 characters', 400, 'VALIDATION_ERROR');
    }

    return userRepository.search(query.trim());
  },

  async getUserBoards(userId: string) {
    const boards = await boardRepository.findAllByUserId(userId);

    return boards.map((board) => {
      const memberRole = board.members?.find((m) => m.userId === userId)?.role;
      return {
        id: board.id,
        title: board.title,
        role: memberRole || 'OWNER',
        isArchived: board.isArchived,
        isFavourite: board.isFavourite,
      };
    });
  },
};