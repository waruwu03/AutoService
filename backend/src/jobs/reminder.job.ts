import { reminderQueue } from '../config/bull.config';
import { prisma } from '../config/database.config';
import { NotificationType } from '@prisma/client';
import { notificationService } from '../services/notification.service';

// Process reminders
reminderQueue.process(async (job) => {
  console.log('🕒 Processing service reminders...');

  const today = new Date();
  const reminderWindow = new Date();
  reminderWindow.setDate(today.getDate() + 7); // 7 days ahead

  // Find active reminders due soon
  const dueReminders = await prisma.serviceReminder.findMany({
    where: {
      status: 'ACTIVE',
      targetDate: {
        lte: reminderWindow,
        gte: today
      },
      notificationSentAt: null
    },
    include: {
      vehicle: {
        include: { customer: true }
      },
      service: true
    }
  });

  for (const reminder of dueReminders) {
    // Create notification for admin/mekanik or customer
    await notificationService.createNotification({
      type: NotificationType.SERVICE_REMINDER,
      title: 'Service Reminder',
      message: `Vehicle ${reminder.vehicle.licensePlate} is due for ${reminder.service?.name || 'service'} on ${reminder.targetDate?.toLocaleDateString()}`,
      referenceType: 'service_reminder',
      referenceId: reminder.id
    });

    // Mark reminder as sent
    await prisma.serviceReminder.update({
      where: { id: reminder.id },
      data: {
        notificationSentAt: new Date(),
        status: 'SENT'
      }
    });

    console.log(`✅ Notification sent for vehicle ${reminder.vehicle.licensePlate}`);
  }

  return { processed: dueReminders.length };
});

// Schedule daily check at 8 AM
reminderQueue.add(
  {},
  {
    repeat: {
      cron: '0 8 * * *'
    }
  }
);
