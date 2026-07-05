import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Avatar } from '../components/common/Avatar';
import { Spinner } from '../components/common/Spinner';
import { Dropdown } from '../components/common/Dropdown';
import { cn } from '../utils/cn';
import { formatDateTime, formatRelativeDate } from '../utils/formatDate';
import type { Priority, Status } from '../types/task';

const priorityOptions = [
  { value: 'LOW', label: 'Low', color: '#6B7280' },
  { value: 'MEDIUM', label: 'Medium', color: '#3B82F6' },
  { value: 'HIGH', label: 'High', color: '#F97316' },
  { value: 'URGENT', label: 'Urgent', color: '#EF4444' },
];

const statusOptions = [
  { value: 'BACKLOG', label: 'Backlog' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'DONE', label: 'Done' },
];

export default function TaskDetailPage() {
  const { boardId, taskId } = useParams<{ boardId: string; taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    tasks,
    fetchTasks,
    updateTask,
    deleteTask,
    addComment,
    deleteComment,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    getActivityLogs,
  } = useTasks();

  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [newChecklistText, setNewChecklistText] = useState('');

  const task = tasks.find((t) => t.id === taskId);

  useEffect(() => {
    if (!boardId) return;
    setIsLoading(true);
    fetchTasks(boardId).finally(() => setIsLoading(false));
  }, [boardId, fetchTasks]);

  useEffect(() => {
    if (taskId) {
      getActivityLogs(taskId);
    }
  }, [taskId, getActivityLogs]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <h2 className="text-lg font-semibold text-kanban-text mb-2">Task not found</h2>
        <Button variant="primary" size="sm" onClick={() => navigate(`/board/${boardId}`)}>
          Back to Board
        </Button>
      </div>
    );
  }

  const completedChecklist = task.checklist?.filter((i) => i.isCompleted).length || 0;
  const totalChecklist = task.checklist?.length || 0;

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-kanban-textMuted">
        <button
          onClick={() => navigate(`/board/${boardId}`)}
          className="hover:text-kanban-text transition-colors"
        >
          Board
        </button>
        <span>/</span>
        <span className="text-kanban-text font-medium truncate max-w-xs">{task.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Meta */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-xl font-bold text-kanban-text">{task.title}</h1>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const newTitle = prompt('Edit title:', task.title);
                    if (newTitle && newTitle !== task.title) {
                      updateTask(task.id, { title: newTitle });
                    }
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={async () => {
                    if (confirm('Delete this task?')) {
                      await deleteTask(task.id);
                      navigate(`/board/${boardId}`);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide',
                  task.priority === 'URGENT' && 'bg-red-100 text-red-700',
                  task.priority === 'HIGH' && 'bg-orange-100 text-orange-700',
                  task.priority === 'MEDIUM' && 'bg-blue-100 text-blue-700',
                  task.priority === 'LOW' && 'bg-gray-100 text-gray-700'
                )}
              >
                {task.priority}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-kanban-bg text-kanban-textMuted">
                {task.status.replace('_', ' ')}
              </span>
              {task.dueDate && (
                <span className={cn(
                  'text-xs px-2 py-1 rounded',
                  new Date(task.dueDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                )}>
                  {formatRelativeDate(task.dueDate)}
                </span>
              )}
            </div>

            {task.description ? (
              <div className="prose prose-sm max-w-none text-kanban-text">
                <p className="whitespace-pre-wrap">{task.description}</p>
              </div>
            ) : (
              <p className="text-sm text-kanban-textMuted italic">No description provided.</p>
            )}
          </div>

          {/* Checklist */}
          <div className="rounded-lg border border-kanban-border bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-kanban-text">
                Checklist {totalChecklist > 0 && `(${completedChecklist}/${totalChecklist})`}
              </h3>
              {totalChecklist > 0 && (
                <div className="h-1.5 w-24 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-kanban-primary transition-all"
                    style={{ width: `${totalChecklist ? (completedChecklist / totalChecklist) * 100 : 0}%` }}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              {task.checklist?.map((item) => (
                <div key={item.id} className="flex items-center gap-3 group">
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={() => toggleChecklistItem(task.id, item.id)}
                    className="h-4 w-4 rounded border-kanban-border text-kanban-primary focus:ring-kanban-primary"
                  />
                  <span className={cn('text-sm flex-1', item.isCompleted && 'line-through text-kanban-textMuted')}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => deleteChecklistItem(task.id, item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-kanban-textMuted hover:text-red-600 transition-all"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <Input
                  placeholder="Add an item..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newChecklistText.trim()) {
                      addChecklistItem(task.id, { text: newChecklistText.trim(), isCompleted: false, order: totalChecklist });
                      setNewChecklistText('');
                    }
                  }}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (newChecklistText.trim()) {
                      addChecklistItem(task.id, { text: newChecklistText.trim(), isCompleted: false, order: totalChecklist });
                      setNewChecklistText('');
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="rounded-lg border border-kanban-border bg-white p-4">
            <h3 className="text-sm font-semibold text-kanban-text mb-3">Comments</h3>
            <div className="space-y-4 mb-4">
              {task.comments?.length === 0 && (
                <p className="text-sm text-kanban-textMuted italic">No comments yet.</p>
              )}
              {task.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <Avatar src={comment.user?.avatarUrl} name={comment.user?.name || 'User'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-kanban-text">{comment.user?.name}</span>
                      <span className="text-xs text-kanban-textMuted">{formatDateTime(comment.createdAt)}</span>
                      {comment.userId === user?.id && (
                        <button
                          onClick={() => deleteComment(task.id, comment.id)}
                          className="opacity-0 group-hover:opacity-100 ml-auto text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-kanban-text whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3">
              <Avatar src={user?.avatarUrl} name={user?.name || 'You'} size="sm" />
              <div className="flex-1 flex items-center gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
                      e.preventDefault();
                      handlePostComment();
                    }
                  }}
                />
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isPostingComment}
                  onClick={handlePostComment}
                  disabled={!commentText.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Details */}
          <div className="rounded-lg border border-kanban-border bg-white p-4">
            <h3 className="text-sm font-semibold text-kanban-text mb-3">Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-kanban-textMuted block mb-1">Status</label>
                <Dropdown
                  options={statusOptions}
                  value={task.status}
                  onChange={(val) => updateTask(task.id, { status: val as Status })}
                  size="sm"
                />
              </div>
              <div>
                <label className="text-xs text-kanban-textMuted block mb-1">Priority</label>
                <Dropdown
                  options={priorityOptions}
                  value={task.priority}
                  onChange={(val) => updateTask(task.id, { priority: val as Priority })}
                  size="sm"
                />
              </div>
              <div>
                <label className="text-xs text-kanban-textMuted block mb-1">Due Date</label>
                <Input
                  type="date"
                  value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateTask(task.id, { dueDate: e.target.value || null })}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-kanban-textMuted block mb-1">Assigned To</label>
                {task.assignedTo ? (
                  <div className="flex items-center gap-2 text-sm text-kanban-text">
                    <Avatar src={task.assignedTo.avatarUrl} name={task.assignedTo.name} size="xs" />
                    <span>{task.assignedTo.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-kanban-textMuted italic">Unassigned</span>
                )}
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="rounded-lg border border-kanban-border bg-white p-4">
            <h3 className="text-sm font-semibold text-kanban-text mb-3">Activity</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
              {task.activityLogs?.length === 0 && (
                <p className="text-xs text-kanban-textMuted italic">No activity yet.</p>
              )}
              {task.activityLogs?.map((log) => (
                <div key={log.id} className="flex gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-kanban-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-kanban-text">
                      <span className="font-medium">{log.user?.name || 'System'}</span>{' '}
                      {log.action}
                    </p>
                    {log.details && <p className="text-xs text-kanban-textMuted">{log.details}</p>}
                    <p className="text-[10px] text-kanban-textMuted mt-0.5">{formatDateTime(log.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  async function handlePostComment() {
    if (!commentText.trim()) return;
    setIsPostingComment(true);
    try {
      await addComment(task!.id, commentText.trim());
      setCommentText('');
    } finally {
      setIsPostingComment(false);
    }
  }
}