// config/websocket.config.ts

import { registerAs } from '@nestjs/config';

export default registerAs('websocket', () => ({
  /**
   * @description Whether WebSocket functionality is enabled globally.
   */
  enabled: process.env.WEBSOCKET_ENABLED !== 'false',

  /**
   * @description Port to use for WebSocket server (optional override for clustering).
   */
  port: parseInt(process.env.WEBSOCKET_PORT || '0', 10), // 0 = use same as HTTP

  /**
   * @description Allowed origins for WebSocket handshake (CORS-like control).
   */
  allowedOrigins: (process.env.WEBSOCKET_ALLOWED_ORIGINS || '*')
    .split(',')
    .map((origin) => origin.trim()),

  /**
   * @description Enable sticky session support for load-balanced environments.
   */
  stickySessions: process.env.WEBSOCKET_STICKY_SESSIONS === 'true',

  /**
   * @description Use Redis or another adapter for WebSocket clustering.
   */
  useAdapter: process.env.WEBSOCKET_USE_ADAPTER || 'none', // 'none' | 'redis' | 'nats' | 'mqtt'

  /**
   * @description Redis config if adapter is set to 'redis'.
   */
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  redisPassword: process.env.REDIS_PASSWORD || '',

  /**
   * @description Enable secure WebSocket (wss) mode.
   */
  secure: process.env.WEBSOCKET_SECURE === 'true',

  /**
   * @description Heartbeat ping interval (ms) for client connection health checks.
   */
  pingInterval: parseInt(process.env.WEBSOCKET_PING_INTERVAL || '30000', 10),

  /**
   * @description Client timeout (ms) if no ping response.
   */
  clientTimeout: parseInt(process.env.WEBSOCKET_CLIENT_TIMEOUT || '60000', 10),
}));


/*
WebSocket (real-time, bi-directional communication) will work within the system — especially important for features like:
- Real-time notifications
- Activity or presence updates
- Chat messaging
- Live dashboards or event feeds

📘 Example Use-Cases
- User Notifications Gateway: Deliver new notifications in real-time.
- Live Dashboard: Push server data updates instantly.
- User Activity Tracking: Show online/offline or typing indicators.

## Special Considerations while using WebSocket
📌 Scalability concerns
🔐 Security considerations
⚙️ Configuration options for flexibility and extensibility



⚖️ WebSocket: Scalability, Availability, and Security Concerns
🧱 Scalability
Native WebSocket is not horizontally scalable without session sharing or message brokering.

Requires sticky sessions or a pub-sub adapter (like Redis, NATS) to synchronize messages across multiple nodes.

Use WEBSOCKET_USE_ADAPTER=redis for this.

Without Redis or a message broker adapter, each WebSocket server works in isolation — not good for multi-instance deployments.

💡 Recommendation:
For production: Use Redis or NATS adapter + sticky session on load balancer (like NGINX, HAProxy).

For development: Use simple in-memory WebSocket (default).

🔐 Security
WebSocket bypasses some traditional HTTP protections.

Secure WebSocket (wss://) is essential in production.

Validate every connection request (handshake event) — use access tokens.

Configure allowed origins to prevent cross-origin WS attacks.

Implement rate-limiting or DoS protections on the WS connection level if needed.

❤️ Real-World Use Cases
In-app real-time notification system

Live chat or messaging system

Push updates (dashboard stats, logs, data stream)

Real-time presence and activity indicators

🧪 Usage
In any service or gateway:

ts

import { ConfigService } from '@nestjs/config';

constructor(private configService: ConfigService) {
  const wsEnabled = this.configService.get('websocket.enabled');
  const adapter = this.configService.get('websocket.useAdapter');
  // Use accordingly
}


Explanation of the Configuration
1. WebSocket Server Setup (server):
- Defines the WebSocket server's port and path for connecting clients.
- The transport option allows you to set whether to use regular WebSockets (websocket) or secure WebSockets (wss). Secure WebSocket (WSS) is recommended for production to ensure encrypted communication.

2. Authentication (authentication):
- WebSocket authentication using a token, typically a JWT passed via headers during the connection handshake.
- The tokenKey defines what header field will be used for authentication (default is Authorization).

3. WebSocket Security (secure):
- Enables WebSocket Secure (WSS) for encrypted communication. SSL certificates are provided through key and cert.

4. Scalability and Load Balancing (scalability):
- Redis Pub/Sub is used to scale WebSocket connections across multiple servers. Redis allows multiple instances of WebSocket servers to communicate with each other and broadcast messages to clients efficiently.
- Redis settings include the host and port configuration.

5. Connection Management (connection):
- Limits the number of concurrent WebSocket connections with maxConnections.
- connectionTimeout ensures that connections that take too long to establish are terminated.
- A heartbeatInterval is used to periodically check the health of WebSocket connections using ping/pong messages.

6. Reconnection (reconnection):
- Configures automatic reconnection logic. If the WebSocket connection is lost, it will attempt to reconnect with a delay between attempts.
- The maxAttempts and delay values can be configured based on your requirements.

7. Message Broadcasting (broadcast):
- Allows broadcasting messages to specific channels or groups of users. By default, all users may receive messages on the global channel.
*/