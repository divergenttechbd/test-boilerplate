// src/config/event-stream.config.ts

import { registerAs } from '@nestjs/config';

export type EventStreamType = 'kafka' | 'nats' | 'none'; // 'none' disables event streaming

export default registerAs('eventStream', () => ({
  /**
   * Type of event streaming mechanism.
   * Options: 'kafka', 'nats', or 'none'.
   * If 'none', all event stream services will be disabled.
   */
  type: (process.env.EVENT_STREAM_TYPE || 'none') as EventStreamType,

  /**
   * Kafka Configuration
   */
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'my-app', // Kafka client identifier
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','), // Kafka broker addresses
    groupId: process.env.KAFKA_GROUP_ID || 'default-consumer-group', // Kafka consumer group ID
    ssl: process.env.KAFKA_SSL === 'true', // Enable SSL if needed
    sasl: process.env.KAFKA_SASL_USERNAME
      ? {
          mechanism: process.env.KAFKA_SASL_MECHANISM || 'plain',
          username: process.env.KAFKA_SASL_USERNAME,
          password: process.env.KAFKA_SASL_PASSWORD,
        }
      : null, // Optional SASL authentication
  },

  /**
   * NATS Configuration
   */
  nats: {
    url: process.env.NATS_URL || 'nats://localhost:4222', // NATS server URL
    name: process.env.NATS_CLIENT_ID || 'my-app-nats-client', // NATS client identifier
    queue: process.env.NATS_QUEUE || 'event-stream', // Queue group name for load balancing
    authToken: process.env.NATS_AUTH_TOKEN || null, // Optional auth token for NATS secure access
    maxReconnectAttempts: parseInt(process.env.NATS_MAX_RECONNECT_ATTEMPTS || '10', 10),
    reconnectTimeWait: parseInt(process.env.NATS_RECONNECT_TIME_WAIT || '2000', 10), // Wait time between reconnects
  },

  /**
   * Common options for reliability and retry handling
   */
  retry: {
    attempts: parseInt(process.env.EVENT_STREAM_RETRY_ATTEMPTS || '5', 10),
    delay: parseInt(process.env.EVENT_STREAM_RETRY_DELAY || '1000', 10), // Delay between retries in ms
  },

  /**
   * Whether to enable internal event logging for debugging
   */
  debug: process.env.EVENT_STREAM_DEBUG === 'true',
}));



/*
event streaming systems like Kafka and NATS, while ensuring it fits different environments (DEV, UAT, PROD) with proper abstraction, 
extensibility, and fallback support.

🧠 Use Cases & Integration

Use Case	Description
Kafka for microservice comms	Ideal for high-throughput, durable messaging across distributed systems.
NATS for lightweight messaging	Lightweight alternative, great for low-latency, ephemeral communication.
Fallback to none	If event-streaming is not required (e.g., small dev setup), system skips integration.
🧱 How to Use Inside a Module (Example)
```ts
import { ConfigType } from '@nestjs/config';
import eventStreamConfig from 'src/config/event-stream.config';

@Injectable()
export class SomeProducerService {
  constructor(
    @Inject(eventStreamConfig.KEY)
    private readonly config: ConfigType<typeof eventStreamConfig>,
  ) {}

  produceSomething(payload: any) {
    if (this.config.type === 'kafka') {
      // Send to Kafka
    } else if (this.config.type === 'nats') {
      // Send to NATS
    } else {
      // No event streaming; maybe log or handle offline
    }
  }
}
```
🔐 Scalability, Availability, Security Overview

Mechanism	Scalability	Availability	Security
Kafka	Linear scale with partitions	High with replication & brokers	SASL, SSL, ACLs (fine-grained access)
NATS	Lightweight, scales with clustering	Excellent with leaf nodes & clusters	Token-based, NKey/Auth, TLS, JetStream ACLs
None	Not scalable	Only for local dev/testing	N/A
✅ Summary of Benefits
Supports both Kafka and NATS with full retry, debugging, and security options.
Designed for production, low-resource, and offline environments.
Promotes a consistent and abstracted integration for all services consuming event streams.
Can easily be integrated with any NestJS-based event bus, custom publishers, or consumers.

Require integrating Kafka/NATS with NestJS producers/consumer
*/