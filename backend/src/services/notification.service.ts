import { prisma } from '../config/database.config';
import { NotificationType } from '@prisma/client';
import { notificationQueue } from '../config/bull.config';
import { getIO } from '../config/socket.config';

export class NotificationService {
  async createNotification(data: {
    userId?: string;
    type: NotificationType;
    title: string;
    message: string;
    referenceType?: string;
    referenceId?: string;
  }) {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
      },
    });

    // Emit real-time notification via Socket.io
    try {
      const io = getIO();
      if (data.userId) {
        io.to(`user_${data.userId}`).emit('notification', notification);
      } else {
        io.emit('notification', notification);
      }
    } catch (err) {
      console.warn("Socket.io emit failed:", err);
    }

    // If it's a high priority notification, we could also queue it for background processing
    if (data.type === NotificationType.LOW_STOCK || data.type === NotificationType.SERVICE_REMINDER) {
      await notificationQueue.add('send-realtime-notification', {
        notificationId: notification.id,
      });
    }

    return notification;
  }

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}

export const notificationService = new NotificationService();
