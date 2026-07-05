import { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useColumns } from './useColumns';
import { useTasks } from './useTasks';
import { Column } from '../types/column';
import { Task } from '../types/task';

interface UseDragAndDropProps {
  boardId: string;
  columns: Column[];
  tasks: Task[];
  onColumnsChange: (columns: Column[]) => void;
  onTasksChange: (tasks: Task[]) => void;
}

interface UseDragAndDropReturn {
  sensors: ReturnType<typeof useSensors>;
  activeColumn: Column | null;
  activeTask: Task | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  dropAnimation: DropAnimation;
}

export function useDragAndDrop({
  boardId,
  columns,
  tasks,
  onColumnsChange,
  onTasksChange,
}: UseDragAndDropProps): UseDragAndDropReturn {
  const { reorderColumns } = useColumns();
  const { reorderTask } = useTasks();

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;

    const column = columns.find((c) => c.id === activeId);
    if (column) {
      setActiveColumn(column);
      return;
    }

    const task = tasks.find((t) => t.id === activeId);
    if (task) {
      setActiveTask(task);
    }
  }, [columns, tasks]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    const overTaskItem = tasks.find((t) => t.id === overId);
    const overColumn = columns.find((c) => c.id === overId);

    if (!activeTaskItem) return;

    // Dropping a task over another task
    if (overTaskItem && activeTaskItem.columnId !== overTaskItem.columnId) {
      const newTasks = tasks.map((t) =>
        t.id === activeId ? { ...t, columnId: overTaskItem.columnId } : t
      );
      onTasksChange(newTasks);
    }

    // Dropping a task over a column (empty column)
    if (overColumn && activeTaskItem.columnId !== overColumn.id) {
      const newTasks = tasks.map((t) =>
        t.id === activeId ? { ...t, columnId: overColumn.id } : t
      );
      onTasksChange(newTasks);
    }
  }, [tasks, columns, onTasksChange]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Column reordering
    const activeColumnItem = columns.find((c) => c.id === activeId);
    const overColumnItem = columns.find((c) => c.id === overId);

    if (activeColumnItem && overColumnItem) {
      const oldIndex = columns.findIndex((c) => c.id === activeId);
      const newIndex = columns.findIndex((c) => c.id === overId);
      const newColumns = arrayMove(columns, oldIndex, newIndex).map((c, index) => ({
        ...c,
        order: index,
      }));
      onColumnsChange(newColumns);

      const reorderData = newColumns.map((c) => ({
        columnId: c.id,
        newOrder: c.order,
      }));
      await reorderColumns(boardId, reorderData);
      return;
    }

    // Task reordering
    const activeTaskItem = tasks.find((t) => t.id === activeId);
    const overTaskItem = tasks.find((t) => t.id === overId);
    const overColumn = columns.find((c) => c.id === overId);

    if (activeTaskItem) {
      let targetColumnId = activeTaskItem.columnId;
      let newOrder = activeTaskItem.order;

      if (overTaskItem) {
        targetColumnId = overTaskItem.columnId;
        const columnTasks = tasks.filter((t) => t.columnId === targetColumnId);
        const overIndex = columnTasks.findIndex((t) => t.id === overId);
        newOrder = overIndex;
      } else if (overColumn) {
        targetColumnId = overColumn.id;
        newOrder = 0;
      }

      if (activeTaskItem.columnId !== targetColumnId || activeTaskItem.order !== newOrder) {
        await reorderTask({
          taskId: activeId,
          sourceColumnId: activeTaskItem.columnId,
          targetColumnId,
          newOrder,
        });
      }
    }
  }, [columns, tasks, boardId, onColumnsChange, onTasksChange, reorderColumns, reorderTask]);

  return {
    sensors,
    activeColumn,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    dropAnimation,
  };
}