import { useEffect } from 'react';
import { useSocket } from '@/components/providers/socket-provider';
import { toast } from 'sonner';

export const useSocketNotifications = (mutateNotifications: () => void) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: any) => {
      // Trigger SWR to re-fetch the notifications list
      mutateNotifications();

      // Show a toast
      toast(notification.title, {
        description: notification.message,
        action: {
          label: 'Lihat',
          onClick: () => console.log('Notification clicked', notification)
        },
      });
    };

    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
    };
  }, [socket, isConnected, mutateNotifications]);
};
