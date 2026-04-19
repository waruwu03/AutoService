import { notificationQueue } from '../config/bull.config';
import { prisma } from '../config/database.config';
import { NotificationType, UserRole } from '@prisma/client';
import { notificationService } from '../services/notification.service';

notificationQueue.process('low-stock-check', async (job) => {
  console.log('📦 Checking for low stock items...');

  // Find low stock items
  const lowStockItems: any[] = await prisma.$queryRaw`
    SELECT * FROM spareparts 
    WHERE stock_quantity <= min_stock 
    AND is_active = true
  `;

  if (lowStockItems.length === 0) return { alerts: 0 };

  // Get warehouse and admin users
  const recipients = await prisma.user.findMany({
    where: {
      role: { in: [UserRole.ADMIN, UserRole.GUDANG] },
      isActive: true
    }
  });

  // Create notifications for each user
  for (const user of recipients) {
    for (const item of lowStockItems) {
      await notificationService.createNotification({
        userId: user.id,
        type: NotificationType.LOW_STOCK,
        title: 'Low Stock Alert',
        message: `${item.name} (${item.code}) is low on stock. Current: ${item.stock_quantity}, Min: ${item.min_stock}`,
        referenceType: 'sparepart',
        referenceId: item.id
      });
    }
  }

  return { alerts: lowStockItems.length };
});

// Check every 4 hours
notificationQueue.add(
  'low-stock-check',
  {},
  {
    repeat: {
      every: 4 * 60 * 60 * 1000 // 4 hours
    }
  }
);
