import { useState, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { Task, CreateTaskInput, UpdateTaskInput, ReorderTaskInput, Comment, Attachment, ChecklistItem } from '../types/task';

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (boardId: string) => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (taskId: string, input: UpdateTaskInput) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  reorderTask: (input: ReorderTaskInput) => Promise<Task>;
  addComment: (taskId: string, content: string) => Promise<Comment>;
  deleteComment: (taskId: string, commentId: string) => Promise<void>;
  addChecklistItem: (taskId: string, item: Omit<ChecklistItem, 'id'>) => Promise<Task>;
  toggleChecklistItem: (taskId: string, itemId: string) => Promise<Task>;
  deleteChecklistItem: (taskId: string, itemId: string) => Promise<Task>;
  uploadAttachment: (taskId: string, file: File) => Promise<Attachment>;
  deleteAttachment: (taskId: string, attachmentId: string) => Promise<void>;
  getActivityLogs: (taskId: string) => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (boardId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks(boardId);
      setTasks(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (input: CreateTaskInput): Promise<Task> => {
    const newTask = await taskService.createTask(input);
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback(async (taskId: string, input: UpdateTaskInput): Promise<Task> => {
    const updated = await taskService.updateTask(taskId, input);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  }, []);

  const deleteTask = useCallback(async (taskId: string): Promise<void> => {
    await taskService.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const reorderTask = useCallback(async (input: ReorderTaskInput): Promise<Task> => {
    const updated = await taskService.reorderTask(input);
    setTasks((prev) => {
      const filtered = prev.filter((t) => t.id !== input.taskId);
      return [...filtered, updated].sort((a, b) => a.order - b.order);
    });
    return updated;
  }, []);

  const addComment = useCallback(async (taskId: string, content: string): Promise<Comment> => {
    const comment = await taskService.addComment(taskId, content);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, comments: [...(t.comments || []), comment] } : t
      )
    );
    return comment;
  }, []);

  const deleteComment = useCallback(async (taskId: string, commentId: string): Promise<void> => {
    await taskService.deleteComment(taskId, commentId);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, comments: (t.comments || []).filter((c) => c.id !== commentId) }
          : t
      )
    );
  }, []);

  const addChecklistItem = useCallback(async (taskId: string, item: Omit<ChecklistItem, 'id'>): Promise<Task> => {
    const updated = await taskService.addChecklistItem(taskId, item);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  }, []);

  const toggleChecklistItem = useCallback(async (taskId: string, itemId: string): Promise<Task> => {
    const updated = await taskService.toggleChecklistItem(taskId, itemId);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  }, []);

  const deleteChecklistItem = useCallback(async (taskId: string, itemId: string): Promise<Task> => {
    const updated = await taskService.deleteChecklistItem(taskId, itemId);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  }, []);

  const uploadAttachment = useCallback(async (taskId: string, file: File): Promise<Attachment> => {
    const attachment = await taskService.uploadAttachment(taskId, file);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, attachments: [...(t.attachments || []), attachment] }
          : t
      )
    );
    return attachment;
  }, []);

  const deleteAttachment = useCallback(async (taskId: string, attachmentId: string): Promise<void> => {
    await taskService.deleteAttachment(taskId, attachmentId);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, attachments: (t.attachments || []).filter((a) => a.id !== attachmentId) }
          : t
      )
    );
  }, []);

  const getActivityLogs = useCallback(async (taskId: string): Promise<void> => {
    const logs = await taskService.getActivityLogs(taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, activityLogs: logs } : t))
    );
  }, []);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTask,
    addComment,
    deleteComment,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    uploadAttachment,
    deleteAttachment,
    getActivityLogs,
  };
}