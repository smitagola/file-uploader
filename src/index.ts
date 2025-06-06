import dotenv from 'dotenv';
dotenv.config(); // Load .env FIRST

import express, { Request, Response, NextFunction } from 'express';
import uploadRouter from './routes/upload';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/upload', uploadRouter);

// Basic health check route
app.get('/', (req: Request, res: Response) => {
  res.send('Document uploader microservice is running');
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
