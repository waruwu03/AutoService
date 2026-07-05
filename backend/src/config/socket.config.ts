import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

let io: Server;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(o => o.trim()).concat(['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
  });

  // Authentication Middleware for Sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback_secret') as any;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id} (User ID: ${socket.data.user?.userId}, Role: ${socket.data.user?.role})`);

    // Join room based on user ID for personal notifications
    if (socket.data.user?.userId) {
      socket.join(`user_${socket.data.user.userId}`);
    }

    // Join room based on role for broadcast notifications (e.g., all MEKANIK, all GUDANG)
    if (socket.data.user?.role) {
      socket.join(`role_${socket.data.user.role}`);
    }

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};
