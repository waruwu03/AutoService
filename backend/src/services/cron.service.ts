import cron from 'node-cron';
import { backupController } from '../controllers/backup.controller';

export class CronService {
  public start() {
    console.log('🕒 Starting Cron Service...');

    // Run daily at midnight (00:00) to create auto-backup
    cron.schedule('0 0 * * *', async () => {
      console.log('🕒 [CRON] Running daily auto-backup...');
      try {
        await backupController.createLocalBackup();
        console.log('✅ [CRON] Auto-backup completed successfully.');
      } catch (error) {
        console.error('❌ [CRON] Auto-backup failed:', error);
      }
    });

    // Run every day at 1 AM to cleanup old backups (older than 14 days)
    cron.schedule('0 1 * * *', async () => {
      console.log('🕒 [CRON] Running auto-backup cleanup...');
      try {
         await backupController.cleanupOldBackups(14);
         console.log('✅ [CRON] Auto-backup cleanup completed.');
      } catch (error) {
        console.error('❌ [CRON] Auto-backup cleanup failed:', error);
      }
    });
  }
}

export const cronService = new CronService();
