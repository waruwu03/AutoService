"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // In Next.js, access local storage for the token
    const token = localStorage.getItem('token');
    
    // Default to localhost:3001 if env var is missing
    const siteUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Remove the /api/v1 suffix if present to connect to the root domain
    const socketUrl = siteUrl.replace(/\/api\/v1$/, '');

    const socketInstance = ClientIO(socketUrl, {
      path: '/socket.io',
      auth: { token },
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('🔌 Socket connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔌 Socket disconnected');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
