import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBoards } from '../hooks/useBoards';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Avatar } from '../components/common/Avatar';
import { Spinner } from '../components/common/Spinner';
import { Modal } from '../components/common/Modal';
import { cn } from '../utils/cn';

export default function BoardSettingsPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { boards, isLoading, updateBoard, deleteBoard, archiveBoard, inviteMember, removeMember } = useBoards();

  const board = boards.find((b) => b.id === boardId);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [isInviting, setIsInviting] = useState(false);
  const [editTitle, setEditTitle] = useState(board?.title || '');
  const [editDesc, setEditDesc] = useState(board?.description || '');
  const [isSaving, setIsSaving] = useState(false);

  const userRole = board?.members?.find((m) => m.userId === user?.id)?.role;
  const canManage = userRole === 'OWNER' || userRole === 'ADMIN';

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <h2 className="text-lg font-semibold text-kanban-text mb-2">Board not found</h2>
        <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <h2 className="text-lg font-semibold text-kanban-text mb-2">Access denied</h2>
        <p className="text-sm text-kanban-textMuted mb-4">Only board owners and admins can manage settings.</p>
        <Button variant="primary" size="sm" onClick={() => navigate(`/board/${boardId}`)}>
          Back to Board
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!editTitle.trim() || editTitle === board.title) return;
    setIsSaving(true);
    try {
      await updateBoard(board.id, { title: editTitle.trim(), description: editDesc.trim() || undefined });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    try {
      await inviteMember(board.id, inviteEmail.trim(), inviteRole);
      setInviteEmail('');
      setIsInviteModalOpen(false);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-kanban-textMuted">
        <button onClick={() => navigate(`/board/${boardId}`)} className="hover:text-kanban-text transition-colors">
          Board
        </button>
        <span>/</span>
        <span className="text-kanban-text font-medium">Settings</span>
      </div>

      <h1 className="text-2xl font-bold text-kanban-text mb-6">Board Settings</h1>

      {/* General Settings */}
      <div className="rounded-lg border border-kanban-border bg-white p-6 mb-6">
        <h2 className="text-lg font-semibold text-kanban-text mb-4">General</h2>
        <div className="space-y-4">
          <Input
            label="Board title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <Input
            label="Description"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="What is this board about?"
          />
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSave} disabled={!editTitle.trim() || editTitle === board.title}>
              Save Changes
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setEditTitle(board.title);
                setEditDesc(board.description || '');
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="rounded-lg border border-kanban-border bg-white p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-kanban-text">Members</h2>
          <Button variant="primary" size="sm" onClick={() => setIsInviteModalOpen(true)}>
            Invite Member
          </Button>
        </div>
        <div className="space-y-3">
          {board.members?.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 rounded-md bg-kanban-bg/50">
              <div className="flex items-center gap-3">
                <Avatar src={member.user?.avatarUrl} name={member.user?.name || 'User'} size="sm" />
                <div>
                  <p className="text-sm font-medium text-kanban-text">{member.user?.name}</p>
                  <p className="text-xs text-kanban-textMuted">{member.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'text-xs font-semibold px-2 py-1 rounded uppercase',
                    member.role === 'OWNER' && 'bg-purple-100 text-purple-700',
                    member.role === 'ADMIN' && 'bg-blue-100 text-blue-700',
                    member.role === 'MEMBER' && 'bg-gray-100 text-gray-700'
                  )}
                >
                  {member.role}
                </span>
                {member.role !== 'OWNER' && (
                  <button
                    onClick={() => removeMember(board.id, member.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-kanban-textMuted hover:text-red-600 transition-colors"
                    title="Remove member"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-200 bg-red-50/50 p-6">
        <h2 className="text-lg font-semibold text-red-700 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-kanban-text">{board.isArchived ? 'Unarchive Board' : 'Archive Board'}</p>
              <p className="text-xs text-kanban-textMuted">
                {board.isArchived ? 'Restore this board to active status.' : 'Hide this board from your workspace. You can restore it later.'}
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => archiveBoard(board.id)}>
              {board.isArchived ? 'Unarchive' : 'Archive'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Delete Board</p>
              <p className="text-xs text-kanban-textMuted">Permanently delete this board and all its data. This cannot be undone.</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete board?"
        description={`This will permanently delete "${board.title}" and all its columns, tasks, and data. This action cannot be undone.`}
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={async () => {
                await deleteBoard(board.id);
                navigate('/dashboard');
              }}
            >
              Delete Board
            </Button>
          </>
        }
      >
        <p className="text-sm text-kanban-textMuted">
          To confirm, type <span className="font-semibold text-kanban-text">{board.title}</span> below:
        </p>
        <Input className="mt-3" placeholder="Type board name to confirm" />
      </Modal>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite member"
        description="Invite a teammate to collaborate on this board."
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" isLoading={isInviting} onClick={handleInvite} disabled={!inviteEmail.trim()}>
              Send Invite
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="teammate@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            autoFocus
          />
          <div>
            <label className="block text-sm font-medium text-kanban-text mb-1">Role</label>
            <div className="flex gap-3">
              {(['ADMIN', 'MEMBER'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setInviteRole(role)}
                  className={cn(
                    'flex-1 rounded-md border px-4 py-3 text-sm text-left transition-colors',
                    inviteRole === role
                      ? 'border-kanban-primary bg-kanban-primary/5 text-kanban-primary'
                      : 'border-kanban-border hover:bg-kanban-bg'
                  )}
                >
                  <span className="font-semibold block">{role === 'ADMIN' ? 'Admin' : 'Member'}</span>
                  <span className="text-xs text-kanban-textMuted">
                    {role === 'ADMIN' ? 'Can manage board settings and members' : 'Can create and edit tasks'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}