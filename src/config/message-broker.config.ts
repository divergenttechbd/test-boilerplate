import { registerAs } from '@nestjs/config';

export default registerAs('message-broker', () => ({
  /**
   * Message Broker Configuration
   */
  broker: {
    type: process.env.MESSAGE_BROKER_TYPE || 'kafka', // Broker type (Kafka, RabbitMQ, etc.)
    host: process.env.MESSAGE_BROKER_HOST || 'localhost', // Broker host
    port: parseInt(process.env.MESSAGE_BROKER_PORT, 10) || 9092, // Broker port
    username: process.env.MESSAGE_BROKER_USERNAME || '', // Optional authentication
    password: process.env.MESSAGE_BROKER_PASSWORD || '', // Optional authentication
    retryAttempts: parseInt(process.env.MESSAGE_BROKER_RETRY_ATTEMPTS, 10) || 5, // Retry attempts for failed messages
    retryDelay: parseInt(process.env.MESSAGE_BROKER_RETRY_DELAY, 10) || 3000, // Delay between retry attempts (in ms)
    maxConcurrency: parseInt(process.env.MESSAGE_BROKER_MAX_CONCURRENCY, 10) || 10, // Max concurrency for processing messages
    timeout: parseInt(process.env.MESSAGE_BROKER_TIMEOUT, 10) || 5000, // Timeout for message processing
    enableLogging: process.env.MESSAGE_BROKER_LOGGING === 'true', // Enable or disable logging of message broker operations
  },

  /**
   * Queue/Topic Definitions (for Kafka, RabbitMQ, etc.)
   */
  queues: {
    mainQueue: process.env.MESSAGE_BROKER_MAIN_QUEUE || 'main_queue', // Main message queue
    retryQueue: process.env.MESSAGE_BROKER_RETRY_QUEUE || 'retry_queue', // Queue for retrying failed messages
    deadLetterQueue: process.env.MESSAGE_BROKER_DEAD_LETTER_QUEUE || 'dead_letter_queue', // Queue for messages that cannot be processed
    // Additional queues/topics can be added here
  },

  /**
   * Message Broker Settings (e.g., Kafka Topics)
   */
  topics: {
    incomingMessages: process.env.MESSAGE_BROKER_INCOMING_TOPIC || 'incoming_messages', // Kafka topic for incoming messages
    outgoingMessages: process.env.MESSAGE_BROKER_OUTGOING_TOPIC || 'outgoing_messages', // Kafka topic for outgoing messages
    // Add additional topics if using Kafka or other message brokers
  },
}));


/*
Message Broker Configuration (message-broker.config.ts)
This configuration will be used to manage the integration with a message broker, such as Kafka, RabbitMQ, or other messaging systems. The configuration will handle settings related to connecting to the message broker, including connection details, queues, retry strategies, and more.

Configuration Details
1. Broker Type:
- Configuration to support different types of message brokers (e.g., Kafka, RabbitMQ).
- This will allow you to easily switch between different brokers depending on your environment and use case.

2. Connection Details:
- Host, port, username, password, and other authentication details required to connect to the message broker.

3. Queues and Topics:
- Definitions for different queues (for RabbitMQ) or topics (for Kafka) that the application will subscribe to or publish messages to.

4. Retry Logic:
- Retry configurations for failed message processing to ensure resilience.

5. Max Concurrency:
- Limits for the number of simultaneous messages that can be processed.

6. Error Handling:
- Configurations for handling errors from message brokers (e.g., if a message cannot be delivered or processed).


Explanation of the Configuration
1. Broker Type:
The type configuration allows you to select which message broker you want to use. It could be kafka, rabbitmq, or another broker. You can easily switch between brokers by updating the .env file.

2.Connection Details:
- host, port, username, and password provide the necessary connection details to connect to the message broker.
- These values are environment-specific and can be configured for development, staging, and production environments.

3. Retry Logic:
- retryAttempts: Number of attempts to retry sending or receiving a message if it fails.
- retryDelay: Delay between each retry attempt in milliseconds.
- This ensures that messages that fail to be processed are retried according to the specified logic.

4. Max Concurrency:
- The maxConcurrency setting defines the maximum number of messages that can be processed concurrently.
- This can help control the load on your system and ensure efficient processing.

5. Error Handling and Logging:
- The enableLogging flag enables or disables logging of message broker operations, which can be useful for debugging and auditing.
- You can log details of each message sent, received, or failed, which will help monitor message processing.

6. Queue and Topic Definitions:
- queues: Defines the names of the queues for different types of messages (e.g., mainQueue, retryQueue, deadLetterQueue).
- topics: Defines the Kafka topics used for publishing and consuming messages (e.g., incomingMessages, outgoingMessages).


*/