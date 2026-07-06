import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBoards } from '../../hooks/useBoards';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { createBoardSchema, CreateBoardFormData } from '../../utils/validators';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateBoardModal({ isOpen, onClose, onSuccess }: CreateBoardModalProps) {
  const { createBoard } = useBoards();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardSchema),
  });

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const onSubmit = async (data: CreateBoardFormData) => {
    setServerError(null);
    try {
      await createBoard(data);
      handleClose();
      onSuccess?.();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to create board');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create new board"
      description="Give your board a name and optional description to get started."
      footer={
        <>
          <Button variant="ghost" size="md" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-board-form"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
          >
            Create Board
          </Button>
        </>
      }
    >
      <form id="create-board-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Board title"
          placeholder="e.g., Q3 Product Roadmap"
          error={errors.title?.message}
          {...register('title')}
        />
        <Input
          label="Description"
          placeholder="What's this board about?"
          error={errors.description?.message}
          {...register('description')}
        />
        {serverError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {serverError}
          </div>
        )}
      </form>
    </Modal>
  );
}