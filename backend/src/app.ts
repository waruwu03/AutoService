import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rate-limit.middleware';
import { ensureBucket } from './config/s3.config';

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
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate Limiting
app.use(process.env.API_PREFIX || '/api/v1', apiLimiter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use(process.env.API_PREFIX || '/api/v1', routes);

// Error Handling
app.use(errorMiddleware);

// Initialize application
const startServer = async () => {
  try {
    // Ensure S3 bucket exists
    try {
      await ensureBucket();
    } catch (s3Error) {
      console.warn('⚠️ Could not connect to S3/MinIO. File uploads may fail:', s3Error.message);
    }
    
    app.listen(port, () => {
      console.log(`
🚀 Server ready at: http://localhost:${port}
📖 Swagger UI: http://localhost:${port}/api-docs
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
