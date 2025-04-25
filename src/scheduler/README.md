Perfect! Let’s move forward with the next essential part of your backend architecture:

---

# 📁 `src/scheduler/` – Background Jobs & Queue Workers

```markdown
# 📦 scheduler/

This folder is responsible for running **background jobs**, **queue consumers**, and **periodic tasks**.

It supports multiple queue drivers (Redis, RabbitMQ, or fallback filesystem-based persistent queue) and follows an organized worker/consumer-based design for scalability.

Jobs may include:
- Email/SMS retries
- Push delivery attempts
- File processing (e.g., image compression, PDF gen)
- Cleanup jobs
- Periodic notifications or reports

---

## 📂 Suggested Structure

```bash
src/scheduler/
├── queue-workers/                  # 🏭 Queue-based background processors
│   ├── notification.worker.ts
│   ├── email.worker.ts
│   ├── file-processor.worker.ts
│   └── ...
├── cron/                           # ⏲️ Scheduled periodic jobs (e.g., via node-cron)
│   ├── cleanup.cron.ts
│   ├── daily-summary.cron.ts
│   └── ...
├── common/                         # 🧰 Shared job interfaces, logic
│   ├── base.job.ts
│   ├── retry.utils.ts
│   └── job-types.enum.ts
├── scheduler.module.ts             # 🎛️ Integrates all workers and crons
```

---

### 🏭 `queue-workers/`

Each worker here **subscribes to a job queue** and processes specific job types.

Example: `notification.worker.ts`

```ts
@Processor('notifications')
export class NotificationWorker {
  constructor(private readonly notifierService: NotifierCoreService) {}

  @Process('send')
  async handleSendJob(job: Job<NotificationPayload>) {
    await this.notifierService.send(job.data);
  }
}
```

- `@Processor(queueName)` handles jobs from a named queue.
- `@Process(jobType)` identifies the job type being processed.
- Uses abstraction from `notifier-core`, `file-storage-core`, etc.

---

### ⏲️ `cron/`

These jobs run on intervals using `@Cron()` or a library like `node-cron`.

Example: `cleanup.cron.ts`

```ts
@Cron('0 3 * * *') // 3:00 AM daily
async cleanGeneratedFiles() {
  await this.fileStorageService.cleanGeneratedFilesOlderThan(24);
}
```

---

### 🧰 `common/`

- `base.job.ts`: Shared interface or class for all job payloads.
- `retry.utils.ts`: Utility to apply retry/backoff strategies.
- `job-types.enum.ts`: Enum for consistent job naming/types.

---

### 🧠 Retry & Backoff Strategy

Here’s a suggested retry pattern using BullMQ:

```ts
@Process('email.send', {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
})
```

You can also use manual retry logic via `retry.utils.ts` for filesystem-based queues.

---

### 📦 `scheduler.module.ts`

The central module that loads all job processors and scheduled tasks:

```ts
@Module({
  imports: [QueueModule],
  providers: [
    NotificationWorker,
    EmailWorker,
    FileProcessorWorker,
    CleanupCron,
    RetryUtils,
  ],
})
export class SchedulerModule {}
```

---

## 🔄 Job Source

Jobs may originate from:
- Events within application modules (e.g., `notifications/`, `uploads/`)
- External event stream (Kafka/NATS)
- Manually from admin panel or system triggers

All jobs should go through the **abstracted queue interface**, not directly push to Redis or FS queue.

---

## ✅ Summary

The `scheduler/` folder:

- Handles async, long-running, or retryable logic
- Supports workers + cron jobs
- Is extensible across environments (FS, Redis, etc.)
- Is cleanly decoupled from infrastructure logic

---
