import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimiter';

// Routes
import authRoutes from './routes/authRoutes';
import boardRoutes from './routes/boardRoutes';
import columnRoutes from './routes/columnRoutes';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

export function createApp(): express.Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(morgan('dev'));
  app.use(requestLogger);

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API rate limiting
  app.use('/api', apiRateLimiter);

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/boards', boardRoutes);
  app.use('/api/columns', columnRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // 404 handler for undefined routes
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        message: 'Route not found',
        code: 'NOT_FOUND',
      },
      statusCode: 404,
    });
  });

  // Centralized error handler (must be last)
  app.use(errorHandler);

  return app;
}