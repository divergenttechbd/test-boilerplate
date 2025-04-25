import { registerAs } from '@nestjs/config';

/**
 * Server-Sent Events (SSE) Configuration
 * 
 * This configuration supports managing server-to-client unidirectional communication
 * using the SSE protocol. It’s especially useful for real-time updates like
 * notifications, system logs, or lightweight status streams.
 * 
 * Note: SSE is not ideal for heavy-scale real-time communication (like chat, gaming),
 * and works best for low-frequency, push-only data.
 */

export default registerAs('sse', () => ({
  /**
   * Enable or disable SSE globally.
   * Used to toggle SSE functionality for environments or feature flagging.
   */
  enabled: process.env.SSE_ENABLED === 'true',

  /**
   * The retry interval (in milliseconds) tells the browser how long to wait before
   * attempting to reconnect after a dropped connection.
   */
  retryInterval: parseInt(process.env.SSE_RETRY_INTERVAL || '3000', 10),

  /**
   * Maximum number of clients allowed to connect simultaneously to SSE.
   * This helps prevent server overload in limited-resource deployments.
   */
  maxClients: parseInt(process.env.SSE_MAX_CLIENTS || '1000', 10),

  /**
   * Interval (in milliseconds) for sending keep-alive messages (heartbeats).
   * Prevents the connection from being closed by proxies or firewalls.
   */
  keepAliveInterval: parseInt(process.env.SSE_KEEP_ALIVE_INTERVAL || '15000', 10),

  /**
   * Number of past messages/events to buffer for late subscribers or retries.
   * Optional: Only needed if implementing buffering/replay logic manually.
   */
  bufferSize: parseInt(process.env.SSE_BUFFER_SIZE || '100', 10),
}));



/*
🧠 Why Use SSE?

Use Case	Why SSE Works Well
Real-time notifications	Lightweight, push-only, fast
System monitoring or status dashboards	Low bandwidth, simple reconnects
Audit trail streaming	One-way, structured event logs
Low-frequency updates	Less overhead than WebSocket
⚙️ Usage in a Service/Gateway
Here’s an example of using this config in a notification gateway or controller:

🔐 Scalability/Security Considerations for SSE
- Scalability: SSE is not ideal for horizontal scaling without sticky sessions or using shared in-memory pub/sub like Redis.
- Security: Use HTTPS to secure the connection. Implement retry mechanisms and connection timeouts properly.




```ts
import { ConfigType } from '@nestjs/config';
import sseConfig from 'src/config/sse.config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SseNotificationService {
  private readonly logger = new Logger(SseNotificationService.name);

  private clients: Map<string, any> = new Map();

  constructor(
    @Inject(sseConfig.KEY)
    private readonly config: ConfigType<typeof sseConfig>,
  ) {}

  addClient(id: string, response: any) {
    if (!this.config.enabled) return;

    if (this.clients.size >= this.config.maxClients) {
      this.logger.warn(`Max SSE clients reached.`);
      response.status(503).end();
      return;
    }

    this.clients.set(id, response);
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    response.write(`event: connected\ndata: {"status": "ok"}\n\n`);

    // Keep-alive ping
    const keepAlive = setInterval(() => {
      response.write(`: ping\n\n`);
    }, this.config.keepAliveInterval);

    response.on('close', () => {
      clearInterval(keepAlive);
      this.clients.delete(id);
    });
  }

  sendToAll(event: string, data: any) {
    for (const [, client] of this.clients) {
      client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    }
  }
}
```
🔐 Security Considerations

Concern	Solution
Data Exposure	Use secure HTTPS, validate user permissions per connection
Authentication	Authenticate client with JWT/API key before streaming
Denial of Service	Use maxClients, implement rate limiting and IP restrictions
Sensitive Info	Sanitize data before streaming
📈 Scalability & Availability

Challenge	Solutions & Tips
Not horizontally scalable	Use sticky sessions or shared pub/sub system (Redis, Kafka)
No built-in failover	Handle retry with retryInterval and buffered messages
State retained per client	Use distributed memory store (Redis) or stream middleware
Load balancer issues	Use ALB/Nginx with sticky sessions or path-based routing
✅ When NOT to Use SSE

Scenario	Use Instead
High-frequency bidirectional chat	WebSocket
Real-time games	WebSocket + UDP fallback
Distributed microservices	Kafka, NATS, RabbitMQ
IoT telemetry/streaming	MQTT, Kafka

🌐 Challenges of Scaling SSE in Horizontal Environments
Sticky Sessions:

In a horizontal scaling environment, without sticky sessions, a new request from the same client might go to a different server instance, causing the SSE connection to break. Sticky sessions tie a client to a specific server during the session, which isn’t always ideal for scaling because it can limit flexibility and load balancing.

No Shared State:

SSE relies on an open connection to each client, and when a client reconnects (e.g., due to a network issue), the new connection has no idea about the previous state or message that may have been pushed during the downtime. This could lead to issues in message delivery and loss of continuity for the user.

Server Overload:

In a high-load situation, each server instance in a cluster has to handle its own set of client connections, which can easily become overwhelming if there’s no centralized control.

Lack of Built-in Message Queue or Pub/Sub Mechanism:

SSE by itself doesn’t have a mechanism for distributing messages across instances or servers. A central mechanism like a message broker (e.g., Redis Pub/Sub, Kafka, or NATS) is required to send messages to all connected clients across multiple servers.

⚙️ Mechanisms for Overcoming SSE Scaling Challenges
Here are some key mechanisms and solutions that could help scale SSE effectively in distributed environments:

1. Sticky Sessions (Session Affinity)
How it helps: 
- Ensures that the client is always routed to the same server instance for the duration of the connection.

Drawback: 
- While this solves the connection issue, it can limit the ability to balance load and might impact resource utilization on the server.

Setup: 
- This can usually be done at the load balancer level (e.g., AWS ALB or Nginx).

Note: Sticky sessions are generally not recommended for highly dynamic or unpredictable loads. It's better to combine this with a centralized messaging mechanism.

2. Shared In-Memory Pub/Sub (e.g., Redis Pub/Sub)
- How it helps: Redis (or similar systems) can serve as a pub/sub system to broadcast events to all instances. This solves the issue of lost messages and ensures that all connected clients, regardless of which server instance they are connected to, receive the same events.

Drawback: 
- Requires Redis (or another pub/sub system) to be available, which adds a complexity layer.
Setup:
- Each instance subscribes to a Redis channel (using ioredis or node-redis).
- Each SSE connection from a client is connected to the appropriate instance, but the event is published to Redis and broadcast to all other instances.
- This guarantees that no matter which server the client is connected to, the messages are synchronized.

3. Message Queueing System (e.g., Kafka, NATS, RabbitMQ)
- How it helps: Instead of relying on a central in-memory store like Redis, you can use a distributed message broker like Kafka or NATS to handle event streams. These systems offer reliable message delivery, persistent queues, and - publish/subscribe capabilities.
- Drawback: More complex setup compared to Redis, but can handle much higher loads and provide better reliability in a microservices-based architecture.

Setup:
- Set up an event producer (such as your application’s service) that writes messages to a topic in Kafka or NATS.
- Your application instances subscribe to this topic and forward events to clients connected via SSE.
- Scalability Benefit: These systems are designed for high-throughput, distributed scaling, and message durability across various nodes.

4. WebSockets as an Alternative
- How it helps: While SSE is unidirectional (server to client), WebSockets support bidirectional communication and are generally more scalable when managed with a centralized broker like Redis, Kafka, or NATS.
- Drawback: WebSockets come with their own set of complexity regarding handling connections, security, and protocols. They also require connection management and might need to be secured using wss://.

Setup:
- Use WebSocket servers (e.g., Socket.IO, ws) for bidirectional communication and scale using Redis/NATS/Kafka.

🚀 Best Practices for Scaling SSE in Real-World Applications
1. Use Redis for Pub/Sub:
- A common pattern for scalable SSE is to use Redis for message broadcasting. Each instance subscribes to a Redis channel, and when an event occurs, it's published to the channel, ensuring all instances broadcast the event to their clients.

2. Deploy with Sticky Sessions (in some cases):
 - If Redis is not an option or if the architecture doesn’t permit it, sticky sessions can ensure SSE connections are maintained with the same server. This is generally not scalable but works in controlled environments.

3. Monitor Client Connections:
- Always ensure there’s a limit on the maximum number of connected clients (maxClients). This avoids overwhelming the server and helps prevent Denial of Service (DoS) due to too many open connections.

4. Keep Connection Management Efficient:
- Use heartbeats and proper error handling to manage connections. Consider implementing backoff strategies when reconnecting clients.
*/