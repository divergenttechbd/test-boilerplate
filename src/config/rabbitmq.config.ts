// config/rabbitmq.config.ts

import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  /**
   * @description Whether RabbitMQ is enabled globally
   */
  enabled: process.env.RABBITMQ_ENABLED !== 'false',

  /**
   * @description URI for connecting to RabbitMQ
   * Format: amqp://user:password@host:port/vhost
   */
  uri: process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672/',

  /**
   * @description Default exchange to use for pub/sub or topic messaging
   */
  defaultExchange: process.env.RABBITMQ_DEFAULT_EXCHANGE || 'main_exchange',

  /**
   * @description Whether to use durable queues (persisted between restarts)
   */
  durableQueue: process.env.RABBITMQ_DURABLE_QUEUE !== 'false',

  /**
   * @description Prefetch count (number of messages to fetch before ACK)
   */
  prefetchCount: parseInt(process.env.RABBITMQ_PREFETCH_COUNT || '10', 10),

  /**
   * @description Routing keys configuration (optional, used for event routing)
   */
  routingKeys: (process.env.RABBITMQ_ROUTING_KEYS || 'default.key')
    .split(',')
    .map((key) => key.trim()),

  /**
   * @description Reconnection retry interval (ms)
   */
  reconnectInterval: parseInt(process.env.RABBITMQ_RECONNECT_INTERVAL || '10000', 10),
}));


/*
RabbitMQ is a popular choice for message brokering — especially in event-driven microservice architectures.

This config will allow fine-tuned control over RabbitMQ-specific settings (connection, exchange, routing keys, etc.), 
and can be used independently of the general queue system if needed (for example, in standalone pub-sub/event-bus patterns).

📘 Example Use-Cases
You might use this RabbitMQ config independently of your main queue system for:

Microservice messaging

Pub/Sub eventing

Notification event broadcasting

Order → payment → invoice chaining

With this config module, services can easily get values like uri, exchange, and routingKeys using ConfigService.


*/