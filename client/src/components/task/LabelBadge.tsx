import { cn } from '../../utils/cn';

interface LabelBadgeProps {
  name: string;
  color: string;
  size?: 'sm' | 'md';
  className?: string;
  onRemove?: () => void;
}

export default function LabelBadge({ name, color, size = 'sm', className, onRemove }: LabelBadgeProps) {
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-colors',
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1',
        className
      )}
      style={{
        backgroundColor: hexToRgba(color, 0.15),
        color: color,
        border: `1px solid ${hexToRgba(color, 0.3)}`,
      }}
    >
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          <svg className={cn('h-3 w-3', size === 'md' && 'h-3.5 w-3.5')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}