import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionOnClick?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionOnClick,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-4', className)}>
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-kanban-bg text-kanban-textMuted">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-kanban-text">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-kanban-textMuted max-w-sm">{description}</p>
      )}
      {actionLabel && actionOnClick && (
        <Button variant="primary" size="sm" className="mt-4" onClick={actionOnClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}