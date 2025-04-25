// src/core/config/notification.config.ts

import { registerAs } from '@nestjs/config';

export default registerAs('notification', () => ({
  /**
   * Channels that are enabled for sending notifications
   * E.g., email, sms, in-app, real-time
   */
  enabledChannels: (process.env.NOTIFY_ENABLED_CHANNELS || 'email,sms,in-app,real-time')
    .split(',')
    .map((channel) => channel.trim()),

  /**
   * Real-time push config — could be SSE or WebSocket
   */
  realTime: {
    transport: process.env.NOTIFY_REALTIME_TRANSPORT || 'sse', // 'sse' | 'websocket'
    retryAttempts: parseInt(process.env.NOTIFY_REALTIME_RETRY_ATTEMPTS, 10) || 3,
    retryDelay: parseInt(process.env.NOTIFY_REALTIME_RETRY_DELAY, 10) || 1000, // in ms
  },

  /**
   * Enable or disable delivery tracking (status logs)
   */
  enableDeliveryReport: process.env.NOTIFY_ENABLE_DELIVERY_REPORT === 'true',

  /**
   * Enable failover (fallback to other channels if primary fails)
   */
  enableFallback: process.env.NOTIFY_ENABLE_FALLBACK === 'true',

  /**
   * Retry logic (for retrying failed deliveries)
   */
  retry: {
    attempts: parseInt(process.env.NOTIFY_RETRY_ATTEMPTS, 10) || 2,
    delay: parseInt(process.env.NOTIFY_RETRY_DELAY, 10) || 1000, // ms
  },

  enabled: process.env.NOTIFY_ENABLED !== 'false',

channelToggle: {
  email: process.env.NOTIFY_EMAIL_ENABLED !== 'false',
  sms: process.env.NOTIFY_SMS_ENABLED !== 'false',
  inApp: process.env.NOTIFY_INAPP_ENABLED !== 'false',
  realTime: process.env.NOTIFY_REALTIME_ENABLED !== 'false',
},

queue: {
  name: process.env.NOTIFY_QUEUE_NAME || 'notification-queue',
  delay: parseInt(process.env.NOTIFY_QUEUE_DELAY || '0'), // in ms
}

}));


/*

📦 Purpose: Configuration for the standalone, event-driven, multi-channel notification system — supporting Email, SMS, Web Push, In-App, Real-time (via WebSocket or SSE), with failover mechanism and delivery report tracking.

🧠 Why It Matters
All system and app-level user notifications are managed from here.

Supports multiple delivery channels with fallback.

Standardizes the event-driven notification pipeline across modules.


Here are a couple of thoughtful enhancements we could add to notification.config.ts to improve flexibility, observability, and future-readiness:

🔧 Optional Enhancements (based on needs)
1. Channel-specific enable/disable config
Allow you to toggle specific channels individually from the .env.

ts

channelToggle: {
  email: process.env.NOTIFY_EMAIL_ENABLED !== 'false',
  sms: process.env.NOTIFY_SMS_ENABLED !== 'false',
  inApp: process.env.NOTIFY_INAPP_ENABLED !== 'false',
  realTime: process.env.NOTIFY_REALTIME_ENABLED !== 'false',
},
Benefits:
Gives granular control for enabling/disabling specific notification types in different environments (e.g. disable SMS in dev).

Keeps audit logs clean if something is intentionally off.

2. Global notification toggle (on/off switch)
ts

enabled: process.env.NOTIFY_ENABLED !== 'false',
Benefits:
Handy during maintenance or while debugging notification failures in production or staging.

Lets devs temporarily pause notifications without removing env values or stopping worker processes.

3. Queue config for notification delivery
If notifications are sent via background jobs (recommended), queue names and delay configs can be exposed here:

ts

queue: {
  name: process.env.NOTIFY_QUEUE_NAME || 'notification-queue',
  delay: parseInt(process.env.NOTIFY_QUEUE_DELAY || '0'), // ms
},
Benefits:
Integrates seamlessly with a message broker (e.g., Redis, BullMQ, Kafka).

Helps ensure retry/delivery consistency across microservices or workers.

🧠 TL;DR — Final Optional Add-ons
Here’s a sneak preview of the additional block we could add only if you want:

ts

enabled: process.env.NOTIFY_ENABLED !== 'false',

channelToggle: {
  email: process.env.NOTIFY_EMAIL_ENABLED !== 'false',
  sms: process.env.NOTIFY_SMS_ENABLED !== 'false',
  inApp: process.env.NOTIFY_INAPP_ENABLED !== 'false',
  realTime: process.env.NOTIFY_REALTIME_ENABLED !== 'false',
},

queue: {
  name: process.env.NOTIFY_QUEUE_NAME || 'notification-queue',
  delay: parseInt(process.env.NOTIFY_QUEUE_DELAY || '0'), // in ms
}

*/