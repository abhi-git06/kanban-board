import { env } from '../config/env';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const levelPriority: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentPriority = levelPriority[env.LOG_LEVEL];

function shouldLog(level: LogLevel): boolean {
  return levelPriority[level] <= currentPriority;
}

function timestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp()}] [${level.toUpperCase()}]: ${message}${metaStr}`;
}

export const logger = {
  error: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('error')) {
      console.error('\x1b[31m%s\x1b[0m', formatMessage('error', message, meta));
    }
  },

  warn: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('warn')) {
      console.warn('\x1b[33m%s\x1b[0m', formatMessage('warn', message, meta));
    }
  },

  info: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('info')) {
      console.info('\x1b[36m%s\x1b[0m', formatMessage('info', message, meta));
    }
  },

  debug: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('debug')) {
      console.debug('\x1b[35m%s\x1b[0m', formatMessage('debug', message, meta));
    }
  },
};