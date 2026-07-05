import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useBoards } from '../hooks/useBoards';
import { useColumns } from '../hooks/useColumns';
import { useTasks } from '../hooks/useTasks';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { cn } from '../utils/cn';
import type { Column as ColumnType } from '../types/column';
import type { Task as TaskType } from '../types/task';

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  const { boards, updateBoard, archiveBoard, favouriteBoard } = useBoards();
  const { columns, fetchColumns, createColumn, deleteColumn, updateColumn } = useColumns();
  const { tasks, fetchTasks, createTask, updateTask, deleteTask } = useTasks();

  const [isLoading, setIsLoading] = useState(true);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  // New column modal
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  // New task modal
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskColumnId, setNewTaskColumnId] = useState<string>('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Edit board title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  const board = boards.find((b) => b.id === boardId);

  useEffect(() => {
    if (!boardId) return;
    setIsLoading(true);
    Promise.all([fetchColumns(boardId), fetchTasks(boardId)]).finally(() => setIsLoading(false));
  }, [boardId, fetchColumns, fetchTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } },
    }),
  };

  // --- DnD Handlers ---
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const col = columns.find((c) => c.id === active.id);
    if (col) {
      setActiveColumn(col);
      return;
    }
    const tsk = tasks.find((t) => t.id === active.id);
    if (tsk) setActiveTask(tsk);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    const overTaskItem = tasks.find((t) => t.id === overId);
    const overColumn = columns.find((c) => c.id === overId);

    if (!activeTaskItem) return;

    if (overTaskItem && activeTaskItem.columnId !== overTaskItem.columnId) {
      // Move task to another column visually
      // (Full optimistic reordering would go here; kept simple for now)
    } else if (overColumn && activeTaskItem.columnId !== overColumn.id) {
      // Move task to empty column visually
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);
    setActiveTask(null);
    if (!over || !boardId) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    // Column reorder
    const activeCol = columns.find((c) => c.id === activeId);
    const overCol = columns.find((c) => c.id === overId);
    if (activeCol && overCol) {
      const oldIndex = columns.findIndex((c) => c.id === activeId);
      const newIndex = columns.findIndex((c) => c.id === overId);
      const newCols = [...columns];
      const [moved] = newCols.splice(oldIndex, 1);
      newCols.splice(newIndex, 0, moved);
      const reordered = newCols.map((c, i) => ({ ...c, order: i }));
      // Optimistic update would happen here via hook
      return;
    }

    // Task reorder / cross-column move
    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem || !boardId) return;

    const overTaskItem = tasks.find((t) => t.id === overId);
    const overColumn = columns.find((c) => c.id === overId);

    let targetColumnId = activeTaskItem.columnId;
    if (overTaskItem) targetColumnId = overTaskItem.columnId;
    else if (overColumn) targetColumnId = overColumn.id;

    if (activeTaskItem.columnId !== targetColumnId) {
      await updateTask(activeId, { columnId: targetColumnId });
    }
  };

  // --- Actions ---
  const handleAddColumn = async () => {
    if (!newColumnTitle.trim() || !boardId) return;
    setIsAddingColumn(true);
    try {
      await createColumn({ boardId, title: newColumnTitle.trim() });
      setNewColumnTitle('');
      setIsAddColumnOpen(false);
    } finally {
      setIsAddingColumn(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !newTaskColumnId || !boardId) return;
    setIsAddingTask(true);
    try {
      await createTask({
        boardId,
        columnId: newTaskColumnId,
        title: newTaskTitle.trim(),
      });
      setNewTaskTitle('');
      setNewTaskColumnId('');
      setIsAddTaskOpen(false);
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleUpdateBoardTitle = async () => {
    if (!board || !editTitle.trim() || editTitle === board.title) {
      setIsEditingTitle(false);
      return;
    }
    await updateBoard(board.id, { title: editTitle.trim() });
    setIsEditingTitle(false);
  };

  if (!boardId) return <div className="p-6">Invalid board ID</div>;

  return (
    <div className="flex h-full flex-col bg-kanban-bg">
      {/* Board Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/50 border-b border-kanban-border shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-64"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateBoardTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
              />
              <Button variant="ghost" size="sm" onClick={handleUpdateBoardTitle}>
                Save
              </Button>
            </div>
          ) : (
            <>
              <h1
                className="text-lg font-bold text-kanban-text cursor-pointer hover:bg-kanban-bg rounded px-2 py-1 -ml-2 transition-colors"
                onClick={() => {
                  setEditTitle(board?.title || '');
                  setIsEditingTitle(true);
                }}
                title="Click to rename"
              >
                {board?.title || 'Untitled Board'}
              </h1>
              <button
                onClick={() => board && favouriteBoard(board.id, !board.isFavourite)}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  board?.isFavourite ? 'text-yellow-500 hover:bg-yellow-50' : 'text-kanban-textMuted hover:bg-kanban-bg'
                )}
                title={board?.isFavourite ? 'Remove from favourites' : 'Add to favourites'}
              >
                <svg className="h-5 w-5" fill={board?.isFavourite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => board && archiveBoard(board.id)}
          >
            {board?.isArchived ? 'Unarchive' : 'Archive'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
            onClick={() => setIsAddColumnOpen(true)}
          >
            Add Column
          </Button>
        </div>
      </div>

      {/* Board Content */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : columns.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyState
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            }
            title="No columns yet"
            description="Add your first column to start organizing tasks."
            actionLabel="Add Column"
            actionOnClick={() => setIsAddColumnOpen(true)}
          />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
            <div className="flex h-full gap-4 min-w-max">
              <SortableContext items={columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
                {columns
                  .sort((a, b) => a.order - b.order)
                  .map((column) => (
                    <div
                      key={column.id}
                      className="flex w-72 flex-col rounded-lg bg-kanban-column max-h-full"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="font-semibold text-sm text-kanban-text truncate">{column.title}</h3>
                          <span className="text-xs text-kanban-textMuted bg-white/60 px-1.5 py-0.5 rounded">
                            {tasks.filter((t) => t.columnId === column.id).length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setNewTaskColumnId(column.id);
                              setIsAddTaskOpen(true);
                            }}
                            className="p-1 rounded hover:bg-white/60 text-kanban-textMuted hover:text-kanban-text transition-colors"
                            title="Add task"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteColumn(column.id)}
                            className="p-1 rounded hover:bg-red-50 text-kanban-textMuted hover:text-red-600 transition-colors"
                            title="Delete column"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Tasks */}
                      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 scrollbar-thin">
                        {tasks
                          .filter((t) => t.columnId === column.id)
                          .sort((a, b) => a.order - b.order)
                          .map((task) => (
                            <div
                              key={task.id}
                              onClick={() => navigate(`/board/${boardId}/task/${task.id}`)}
                              className={cn(
                                'group rounded-md bg-white p-3 shadow-card cursor-pointer transition-all',
                                'hover:shadow-lg border border-transparent hover:border-kanban-primary/20'
                              )}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="text-sm font-medium text-kanban-text line-clamp-2">{task.title}</h4>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTask(task.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-kanban-textMuted hover:text-red-600 transition-all"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              {task.priority && (
                                <span
                                  className={cn(
                                    'inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide',
                                    task.priority === 'URGENT' && 'bg-red-100 text-red-700',
                                    task.priority === 'HIGH' && 'bg-orange-100 text-orange-700',
                                    task.priority === 'MEDIUM' && 'bg-blue-100 text-blue-700',
                                    task.priority === 'LOW' && 'bg-gray-100 text-gray-700'
                                  )}
                                >
                                  {task.priority}
                                </span>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  {task.dueDate && (
                                    <span className="text-[10px] text-kanban-textMuted flex items-center gap-1">
                                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                {task.assignedTo && (
                                  <div className="h-5 w-5 rounded-full bg-kanban-primary text-white text-[10px] flex items-center justify-center font-medium">
                                    {task.assignedTo.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </SortableContext>

              {/* Add Column Button (inline) */}
              <button
                onClick={() => setIsAddColumnOpen(true)}
                className="flex h-fit w-72 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-kanban-border bg-kanban-bg p-4 text-sm font-medium text-kanban-textMuted hover:border-kanban-primary/40 hover:text-kanban-text transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add another column
              </button>
            </div>
          </div>

          <DragOverlay dropAnimation={dropAnimation}>
            {activeColumn ? (
              <div className="flex w-72 flex-col rounded-lg bg-kanban-column opacity-90">
                <div className="p-3 font-semibold text-sm text-kanban-text">{activeColumn.title}</div>
              </div>
            ) : null}
            {activeTask ? (
              <div className="rounded-md bg-white p-3 shadow-lg border border-kanban-primary/20 w-64">
                <h4 className="text-sm font-medium text-kanban-text">{activeTask.title}</h4>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Add Column Modal */}
      <Modal
        isOpen={isAddColumnOpen}
        onClose={() => setIsAddColumnOpen(false)}
        title="Add column"
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setIsAddColumnOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              isLoading={isAddingColumn}
              onClick={handleAddColumn}
              disabled={!newColumnTitle.trim()}
            >
              Add Column
            </Button>
          </>
        }
      >
        <Input
          label="Column title"
          placeholder="e.g., In Progress"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
        />
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddTaskOpen}
        onClose={() => {
          setIsAddTaskOpen(false);
          setNewTaskColumnId('');
          setNewTaskTitle('');
        }}
        title="Add task"
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setIsAddTaskOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              isLoading={isAddingTask}
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim()}
            >
              Add Task
            </Button>
          </>
        }
      >
        <Input
          label="Task title"
          placeholder="What needs to be done?"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
      </Modal>
    </div>
  );
}