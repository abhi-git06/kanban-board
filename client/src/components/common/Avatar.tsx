import React from 'react';
import { cn } from '../../utils/cn';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  onClick?: () => void;
}

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const statusColorMap = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

const statusSizeMap = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, name, size = 'md', className, status, onClick }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    const showFallback = !src || hasError;

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex flex-shrink-0', className)}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <div
          className={cn(
            'inline-flex items-center justify-center rounded-full overflow-hidden bg-kanban-primary text-white font-semibold select-none',
            sizeMap[size],
            onClick && 'cursor-pointer hover:opacity-90 transition-opacity'
          )}
          title={name}
        >
          {showFallback ? (
            <span className="leading-none">{getInitials(name)}</span>
          ) : (
            <img
              src={src}
              alt={name}
              className="h-full w-full object-cover"
              onError={() => setHasError(true)}
              loading="lazy"
            />
          )}
        </div>

        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
              statusColorMap[status],
              statusSizeMap[size]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';