export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', color: '#6B7280' },
  { value: 'MEDIUM', label: 'Medium', color: '#3B82F6' },
  { value: 'HIGH', label: 'High', color: '#F97316' },
  { value: 'URGENT', label: 'Urgent', color: '#EF4444' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'BACKLOG', label: 'Backlog' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'DONE', label: 'Done' },
] as const;

export const PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  LOW: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
  MEDIUM: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  HIGH: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  URGENT: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
};

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  BACKLOG: { bg: 'bg-gray-100', text: 'text-gray-600' },
  TODO: { bg: 'bg-blue-100', text: 'text-blue-600' },
  IN_PROGRESS: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  REVIEW: { bg: 'bg-purple-100', text: 'text-purple-700' },
  DONE: { bg: 'bg-green-100', text: 'text-green-700' },
};

export const DEFAULT_COLUMN_TITLES = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/json',
];