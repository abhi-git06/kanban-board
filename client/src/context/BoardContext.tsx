import React, { createContext, useState, useCallback, useContext } from 'react';
import { Board } from '../types/board';
import { Column } from '../types/column';
import { Task } from '../types/task';
import { useBoards } from '../hooks/useBoards';
import { useColumns } from '../hooks/useColumns';
import { useTasks } from '../hooks/useTasks';

interface BoardContextValue {
  activeBoard: Board | null;
  columns: Column[];
  tasks: Task[];
  isLoading: boolean;
  setActiveBoard: (board: Board | null) => void;
  loadBoard: (boardId: string) => Promise<void>;
  refreshBoard: () => Promise<void>;
  optimisticReorderColumn: (columns: Column[]) => void;
  optimisticReorderTask: (tasks: Task[]) => void;
}

export const BoardContext = createContext<BoardContextValue | undefined>(undefined);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const { getBoard } = useBoards();
  const { fetchColumns } = useColumns();
  const { fetchTasks } = useTasks();

  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadBoard = useCallback(async (boardId: string) => {
    setIsLoading(true);
    try {
      const board = await getBoard(boardId);
      if (board) {
        setActiveBoard(board);
        setColumns(board.columns || []);
        setTasks(
          (board.columns || []).flatMap((col) => col.tasks || [])
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [getBoard]);

  const refreshBoard = useCallback(async () => {
    if (activeBoard?.id) {
      await loadBoard(activeBoard.id);
    }
  }, [activeBoard, loadBoard]);

  const optimisticReorderColumn = useCallback((newColumns: Column[]) => {
    setColumns(newColumns);
  }, []);

  const optimisticReorderTask = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, []);

  const value: BoardContextValue = {
    activeBoard,
    columns,
    tasks,
    isLoading,
    setActiveBoard,
    loadBoard,
    refreshBoard,
    optimisticReorderColumn,
    optimisticReorderTask,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoardContext(): BoardContextValue {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
}