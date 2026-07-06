import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rate-limit.middleware';
import path from 'path';
import { createServer } from 'http';
import { initializeSocket } from './config/socket.config';

const app: Express = express();
const port = process.env.PORT || 3001;

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AutoServis API Docs',
      version: '1.0.0',
      description: 'API documentation for AutoServis management system',
    },
    servers: [
      {
        url: `http://localhost:${port}${process.env.API_PREFIX || '/api/v1'}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.join(process.cwd(), 'src', 'routes', '*.ts'),
    path.join(process.cwd(), 'src', 'routes', '*.js'),
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: (origin, callback) => {
    const allowed = (process.env.CORS_ORIGIN || 'http://localhost:3000')
      .split(',')
      .map(o => o.trim())
      .concat(['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']);
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate Limiting
app.use(process.env.API_PREFIX || '/api/v1', apiLimiter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Serve local uploads folder as fallback when Minio is not used
app.use(`${process.env.API_PREFIX || '/api/v1'}/uploads`, express.static('uploads'));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to AutoServis API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/health'
  });
});

// Routes
app.use(process.env.API_PREFIX || '/api/v1', routes);

// Error Handling
app.use(errorMiddleware);

import { cronService } from './services/cron.service';

// Initialize application
const startServer = async () => {
  try {
    const httpServer = createServer(app);
    initializeSocket(httpServer);
    cronService.start();

    httpServer.listen(port, () => {
      console.log(`
🚀 Server ready at: http://localhost:${port}
📖 Swagger UI: http://localhost:${port}/api-docs
🔌 WebSockets Enabled
🕒 Auto-Backup Cron Service Started
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export default app;
