import express, { Request, Response, NextFunction } from 'express';
import healthRoutes from './routes/healthRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { env } from './config/env.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', healthRoutes);
app.use('/api/v1/iam/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, code: 'NOT_FOUND', message: 'Route not found' });
});

// Error Handling Middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, code: 'INTERNAL_SERVER_ERROR', message: err.message });
});

app.listen(env.PORT, () => {
  console.log(`🚀 IAM Service listening at http://localhost:${env.PORT}`);
});
