// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

// Debug: Log environment variable loading
console.log('Environment file path:', envPath);
console.log('API Key loaded:', process.env.GOOGLE_API_KEY ? 'Yes' : 'No');

// Use async function to load modules after environment variables
async function startServer() {
  // Import modules after environment variables are loaded
  const express = (await import('express')).default;
  const cors = (await import('cors')).default;
  const helmet = (await import('helmet')).default;
  const morgan = (await import('morgan')).default;
  const rateLimit = (await import('express-rate-limit')).default;
  const { createServer } = await import('http');
  const logger = (await import('./utils/logger.js')).default;
  const { errorHandler, notFound } = await import('./middleware/errorMiddleware.js');
  const textRoutes = (await import('./routes/textRoutes.js')).default;

  const app = express();
  const server = createServer(app);
  const PORT = process.env.PORT || 3001;

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api/', limiter);

  // Logging
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'text-summarizer-backend'
    });
  });

  // API routes
  app.use('/api/text', textRoutes);

  // Error handling middleware
  app.use(notFound);
  app.use(errorHandler);

  // Start server
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      logger.info('Process terminated');
    });
  });

  return app;
}

// Start the server
startServer().catch(console.error);