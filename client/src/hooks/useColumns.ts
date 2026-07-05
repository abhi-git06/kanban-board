import { useState, useCallback } from 'react';
import { columnService } from '../services/columnService';
import { Column, CreateColumnInput, UpdateColumnInput, ReorderColumnInput } from '../types/column';

interface UseColumnsReturn {
  columns: Column[];
  isLoading: boolean;
  error: string | null;
  fetchColumns: (boardId: string) => Promise<void>;
  createColumn: (input: CreateColumnInput) => Promise<Column>;
  updateColumn: (columnId: string, input: UpdateColumnInput) => Promise<Column>;
  deleteColumn: (columnId: string) => Promise<void>;
  reorderColumns: (boardId: string, reorderData: ReorderColumnInput[]) => Promise<Column[]>;
}

export function useColumns(): UseColumnsReturn {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColumns = useCallback(async (boardId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await columnService.getColumns(boardId);
      setColumns(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load columns');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createColumn = useCallback(async (input: CreateColumnInput): Promise<Column> => {
    const newColumn = await columnService.createColumn(input);
    setColumns((prev) => [...prev, newColumn].sort((a, b) => a.order - b.order));
    return newColumn;
  }, []);

  const updateColumn = useCallback(async (columnId: string, input: UpdateColumnInput): Promise<Column> => {
    const updated = await columnService.updateColumn(columnId, input);
    setColumns((prev) =>
      prev.map((c) => (c.id === columnId ? updated : c)).sort((a, b) => a.order - b.order)
    );
    return updated;
  }, []);

  const deleteColumn = useCallback(async (columnId: string): Promise<void> => {
    await columnService.deleteColumn(columnId);
    setColumns((prev) => prev.filter((c) => c.id !== columnId));
  }, []);

  const reorderColumns = useCallback(async (boardId: string, reorderData: ReorderColumnInput[]): Promise<Column[]> => {
    const updated = await columnService.reorderColumns(boardId, reorderData);
    setColumns(updated.sort((a, b) => a.order - b.order));
    return updated;
  }, []);

  return {
    columns,
    isLoading,
    error,
    fetchColumns,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
  };
}