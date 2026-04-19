// src/config/bull.config.ts

import Bull from 'bull';
import { redisConfig } from './redis.config';

const bullRedisConfig = {
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
};

export const notificationQueue = new Bull('notifications', {
  redis: bullRedisConfig,
});

export const reminderQueue = new Bull('reminders', {
  redis: bullRedisConfig,
});

export const reportQueue = new Bull('reports', {
  redis: bullRedisConfig,
});

// Log queue events
[notificationQueue, reminderQueue, reportQueue].forEach((queue) => {
  queue.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed in queue ${job.queue.name}`);
  });

  queue.on('failed', (job, err) => {
    console.error(
      `❌ Job ${job.id} failed in queue ${job.queue.name}:`,
      err.message
    );
  });
});

export default { notificationQueue, reminderQueue, reportQueue };
