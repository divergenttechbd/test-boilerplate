// config/queue.config.ts

import { registerAs } from '@nestjs/config';
import * as path from 'path';

export type QueueDriverType = 'memory' | 'filesystem' | 'redis' | 'rabbitmq';

export default registerAs('queue', () => {
  const environment = process.env.NODE_ENV || 'development';

  // Default job path based on driver and environment
  const isDev = environment === 'development';
  const defaultFsPath = isDev
    ? path.resolve(process.cwd(), 'src/assets/jobs')
    : path.resolve(process.env.FILE_EXTERNAL_BASE_PATH || '/mnt/files', 'jobs');

  return {
    /**
     * @description Type of queue driver to use
     * Options: memory | filesystem | redis | rabbitmq
     */
    driver: (process.env.QUEUE_DRIVER || 'memory') as QueueDriverType,

    /**
     * @description Common job options (used in all drivers)
     */
    defaultJobOptions: {
      attempts: parseInt(process.env.QUEUE_JOB_ATTEMPTS || '3', 10),
      backoff: parseInt(process.env.QUEUE_JOB_BACKOFF || '3000', 10), // in ms
      removeOnComplete: process.env.QUEUE_JOB_REMOVE_ON_COMPLETE !== 'false',
      removeOnFail: process.env.QUEUE_JOB_REMOVE_ON_FAIL === 'true',
    },

    /**
     * @description Redis Queue Driver Config
     */
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      },

    /**
     * @description RabbitMQ Queue Driver Config
     */
    rabbitmq: {
      url: process.env.RABBITMQ_URI || 'amqp://localhost',
      queueName: process.env.QUEUE_RABBITMQ_QUEUE_NAME || 'dtl_queue',
    },

    /**
     * @description Filesystem Queue Driver Config
     * This is useful when Redis or RabbitMQ is not available
     */
    filesystem: {
      path: process.env.QUEUE_FS_PATH || defaultFsPath,
      persist: process.env.QUEUE_FS_PERSIST !== 'false',
    },
  };
});



/*
That's a very thoughtful and inclusive approach — totally aligned with real-world product scaling concerns. Here's how we can address it:

✅ Enhanced Queue System Design
We’ll support the following driver types via config:


Driver	Persistence	Requirements	Ideal For
memory	❌ No	None	Dev/testing, lightweight ops
filesystem	✅ Yes	Node FS	Low-budget persistent fallback
redis	✅ Yes	Redis	Scalable real-time jobs
rabbitmq	✅ Yes	RabbitMQ	Advanced enterprise queueing
🧠 Architecture Approach
We'll create a Queue Abstraction Layer that:

Normalizes API across all drivers (addJob, processJob, retryJob, etc.)

Dynamically loads and wires appropriate provider (e.g., QueueFilesystemService, QueueRedisService)

Applies shared behaviors like retries, concurrency, backoff

Each driver module will implement a common interface (e.g., IQueueAdapter).

📁 Suggested File Structure
cpp

src/
└── infrastructure/
    └── queue/
        ├── queue.module.ts
        ├── queue.service.ts         # Exposes unified methods
        ├── drivers/
        │   ├── memory.queue.ts
        │   ├── redis.queue.ts
        │   ├── rabbitmq.queue.ts
        │   └── filesystem.queue.ts
        └── interfaces/
            └── queue.interface.ts   # addJob(), process(), etc.


⚙️ Use Example
All services using the queue will interact via a consistent QueueService:

ts

await this.queueService.addJob('sendEmail', { to: 'user@example.com' });
Regardless of whether the backend is Redis or filesystem, the job behavior is the same.

✅ Example Resolved Path Summary

Environment	Driver	Path	Persistent
Development	filesystem	src/assets/jobs/	✅
UAT/Test	filesystem	$FILE_EXTERNAL_BASE_PATH/jobs/	✅
Production	filesystem	$FILE_EXTERNAL_BASE_PATH/jobs/	✅
Any	memory	❌ (in-memory only)	❌
Any	redis/rabbit	Redis/RabbitMQ external queue services	✅
✅ Next Steps:
Add queue abstraction interface and driver implementations.

Wire up the QueueModule using dynamic module registration based on this config.

Would you like me to proceed with the interface and QueueModule

*/