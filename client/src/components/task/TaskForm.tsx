import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Task, Priority, Status } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import { Input } from '../common/Input';
import { Dropdown } from '../common/Dropdown';
import { Button } from '../common/Button';
import { createTaskSchema, CreateTaskFormData } from '../../utils/validators';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../constants';

interface TaskFormProps {
  boardId: string;
  columnId: string;
  initialTask?: Partial<Task>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TaskForm({ boardId, columnId, initialTask, onSuccess, onCancel }: TaskFormProps) {
  const { createTask, updateTask } = useTasks();
  const isEditing = !!initialTask?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: initialTask?.title || '',
      description: initialTask?.description || '',
      priority: initialTask?.priority || 'MEDIUM',
      status: initialTask?.status || 'TODO',
      dueDate: initialTask?.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : undefined,
    },
  });

  const watchedPriority = watch('priority');
  const watchedStatus = watch('status');

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      if (isEditing && initialTask?.id) {
        await updateTask(initialTask.id, {
          ...data,
          dueDate: data.dueDate || null,
        });
      } else {
        await createTask({
          boardId,
          columnId,
          ...data,
          dueDate: data.dueDate || null,
        });
      }
      onSuccess?.();
    } catch {
      // Error handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Task title"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label className="block text-sm font-medium text-kanban-text mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Add more details..."
          className="block w-full rounded-md border border-kanban-border px-3 py-2 text-sm text-kanban-text placeholder:text-kanban-textMuted focus:border-kanban-primary focus:outline-none focus:ring-1 focus:ring-kanban-primary/20 resize-none"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Dropdown
          label="Priority"
          options={PRIORITY_OPTIONS.map((p) => ({ value: p.value, label: p.label, color: p.color }))}
          value={watchedPriority}
          onChange={(val) => setValue('priority', val as Priority)}
        />
        <Dropdown
          label="Status"
          options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
          value={watchedStatus}
          onChange={(val) => setValue('status', val as Status)}
        />
      </div>

      <Input
        label="Due Date"
        type="date"
        {...register('dueDate')}
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button variant="ghost" size="md" onClick={onCancel} type="button">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}