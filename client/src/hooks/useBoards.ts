import { useState, useCallback, useEffect } from 'react';
import { boardService } from '../services/boardService';
import { Board, CreateBoardInput, UpdateBoardInput } from '../types/board';

interface UseBoardsReturn {
  boards: Board[];
  isLoading: boolean;
  error: string | null;
  fetchBoards: () => Promise<void>;
  createBoard: (input: CreateBoardInput) => Promise<Board>;
  updateBoard: (boardId: string, input: UpdateBoardInput) => Promise<Board>;
  deleteBoard: (boardId: string) => Promise<void>;
  archiveBoard: (boardId: string) => Promise<Board>;
  favouriteBoard: (boardId: string, isFavourite: boolean) => Promise<Board>;
}

export function useBoards(): UseBoardsReturn {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await boardService.getBoards();
      setBoards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load boards');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBoard = useCallback(async (input: CreateBoardInput): Promise<Board> => {
    const newBoard = await boardService.createBoard(input);
    setBoards((prev) => [newBoard, ...prev]);
    return newBoard;
  }, []);

  const updateBoard = useCallback(async (boardId: string, input: UpdateBoardInput): Promise<Board> => {
    const updated = await boardService.updateBoard(boardId, input);
    setBoards((prev) => prev.map((b) => (b.id === boardId ? updated : b)));
    return updated;
  }, []);

  const deleteBoard = useCallback(async (boardId: string): Promise<void> => {
    await boardService.deleteBoard(boardId);
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
  }, []);

  const archiveBoard = useCallback(async (boardId: string): Promise<Board> => {
    const updated = await boardService.archiveBoard(boardId);
    setBoards((prev) => prev.map((b) => (b.id === boardId ? updated : b)));
    return updated;
  }, []);

  const favouriteBoard = useCallback(async (boardId: string, isFavourite: boolean): Promise<Board> => {
    const updated = await boardService.favouriteBoard(boardId, isFavourite);
    setBoards((prev) => prev.map((b) => (b.id === boardId ? updated : b)));
    return updated;
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return {
    boards,
    isLoading,
    error,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    archiveBoard,
    favouriteBoard,
  };
}