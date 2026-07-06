import { useState } from 'react';
import { Task } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Dropdown } from '../common/Dropdown';
import PriorityBadge from './PriorityBadge';
import { formatDateTime, formatRelativeDate, isOverdue } from '../../utils/formatDate';
import { cn } from '../../utils/cn';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../constants';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const { user } = useAuth();
  const {
    updateTask,
    deleteTask,
    addComment,
    deleteComment,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
  } = useTasks();

  const [commentText, setCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);

  if (!task) return null;

  const completedChecklist = task.checklist?.filter((i) => i.isCompleted).length || 0;
  const totalChecklist = task.checklist?.length || 0;

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setIsPostingComment(true);
    try {
      await addComment(task.id, commentText.trim());
      setCommentText('');
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleAddChecklist = async () => {
    if (!newChecklistText.trim()) return;
    setIsAddingChecklist(true);
    try {
      await addChecklistItem(task.id, {
        text: newChecklistText.trim(),
        order: totalChecklist,
      });
      setNewChecklistText('');
    } finally {
      setIsAddingChecklist(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="danger"
            size="sm"
            onClick={async () => {
              if (confirm('Delete this task?')) {
                await deleteTask(task.id);
                onClose();
              }
            }}
          >
            Delete Task
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-kanban-text mb-2">Description</h4>
            {task.description ? (
              <p className="text-sm text-kanban-text whitespace-pre-wrap">{task.description}</p>
            ) : (
              <p className="text-sm text-kanban-textMuted italic">No description provided.</p>
            )}
          </div>

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-kanban-text">
                Checklist {totalChecklist > 0 && `(${completedChecklist}/${totalChecklist})`}
              </h4>
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
                    if (e.key === 'Enter' && newChecklistText.trim()) handleAddChecklist();
                  }}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddChecklist}
                  isLoading={isAddingChecklist}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div>
            <h4 className="text-sm font-semibold text-kanban-text mb-3">Comments</h4>
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto scrollbar-thin">
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
          <div className="rounded-lg border border-kanban-border bg-gray-50/50 p-4">
            <h4 className="text-sm font-semibold text-kanban-text mb-3">Details</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-kanban-textMuted block mb-1">Status</label>
                <Dropdown
                  options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
                  value={task.status}
                  onChange={(val) => updateTask(task.id, { status: val as any })}
                  size="sm"
                />
              </div>
              <div>
                <label className="text-xs text-kanban-textMuted block mb-1">Priority</label>
                <Dropdown
                  options={PRIORITY_OPTIONS.map((p) => ({ value: p.value, label: p.label, color: p.color }))}
                  value={task.priority}
                  onChange={(val) => updateTask(task.id, { priority: val as any })}
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

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="rounded-lg border border-kanban-border bg-gray-50/50 p-4">
              <h4 className="text-sm font-semibold text-kanban-text mb-2">Labels</h4>
              <div className="flex flex-wrap gap-1.5">
                {task.labels.map((label) => (
                  <span
                    key={label.id}
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{ backgroundColor: label.color + '20', color: label.color }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div className="rounded-lg border border-kanban-border bg-gray-50/50 p-4">
            <h4 className="text-sm font-semibold text-kanban-text mb-3">Activity</h4>
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin">
              {task.activityLogs?.length === 0 && (
                <p className="text-xs text-kanban-textMuted italic">No activity yet.</p>
              )}
              {task.activityLogs?.map((log) => (
                <div key={log.id} className="flex gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-kanban-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-kanban-text">
                      <span className="font-medium">{log.user?.name || 'System'}</span> {log.action}
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
    </Modal>
  );
}