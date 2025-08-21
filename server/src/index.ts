import express from 'express';
import cors from 'cors';
import { initDatabase } from './db';
import authRoutes from './routes/auth';
import todoRoutes from './routes/todos';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ],
  credentials: true
}));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});


app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


async function startServer() {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();


process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  process.exit(0);
});
