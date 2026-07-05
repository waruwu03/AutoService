'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { getAccessToken } from '@/lib/storage'
import { toast } from 'sonner'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

// Audio context logic to ensure we can play sound across browsers
const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Play a short double-beep
    const playBeep = (freq: number, startTime: number, duration: number) => {
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()
      
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime)
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime + startTime)
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + startTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTime + duration)
      
      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      
      oscillator.start(audioCtx.currentTime + startTime)
      oscillator.stop(audioCtx.currentTime + startTime + duration)
    }

    // High pitch beep
    playBeep(880, 0, 0.2) // A5
    playBeep(1046.50, 0.15, 0.3) // C6
  } catch (err) {
    console.log('Audio playback failed', err)
  }
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Only connect if we have a user
    if (!user) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
      return
    }

    const token = getAccessToken()
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

    const socketInstance = io(backendUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      console.log('Socket connected')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    // Listen for notification events
    socketInstance.on('notification', (notification) => {
      console.log('Received notification:', notification)
      
      // Play sound
      playNotificationSound()
      
      // Show toast
      toast(notification.title || 'Pemberitahuan Baru', {
        description: notification.message || 'Anda memiliki pemberitahuan baru.',
        duration: 8000,
        action: {
          label: 'Tutup',
          onClick: () => console.log('Notification closed'),
        },
      })
      
      // Dispatch a custom event so other components (like the bell icon) can react
      window.dispatchEvent(new CustomEvent('new-notification', { detail: notification }))
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [user]) // Reconnect when user changes (e.g. login/logout)

  const value = {
    socket,
    isConnected
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
