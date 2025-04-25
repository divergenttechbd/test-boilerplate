// config/rate-limit.config.ts

import { registerAs } from '@nestjs/config';

export default registerAs('rateLimit', () => ({
  /**
   * @description Enable or disable rate limiting globally
   */
  enabled: process.env.RATE_LIMIT_ENABLED !== 'false',

  /**
   * @description Requests allowed per time window
   */
  limit: parseInt(process.env.RATE_LIMIT_LIMIT || '100', 10),

  /**
   * @description Time window in milliseconds
   */
  ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10),

  /**
   * @description Whether to use the application's cache layer (e.g., Redis, memory, etc.)
   * Instead of configuring a separate Redis for rate limiting
   */
  useCacheBackend: process.env.RATE_LIMIT_USE_CACHE_BACKEND !== 'false',

  /**
   * @description Whitelisted IPs that bypass rate limiting
   */
  whitelist: (process.env.RATE_LIMIT_WHITELIST || '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean),
}));



/*

This configuration is crucial for protecting your API endpoints from abuse or overuse. 
We'll support flexible throttling mechanisms that can be adapted based on environment or criticality of the route.

🔧 Use Case
This configuration can be consumed inside a custom rate-limiter module (e.g., using @nestjs/throttler or a custom implementation). 
If Redis is enabled, the rate limit store will sync across instances, which is important in load-balanced deployments.

We can conditionally provide the Redis store for @nestjs/throttler or fallback to memory-based throttling.

1. Avoid Redis duplication
We should not configure Redis separately for rate limiting if it's already part of the caching layer. Instead, we’ll reuse the existing 
cache configuration to power rate limiting when needed. This keeps things DRY, modular, and easier to maintain.

2. Ensure fallback compatibility
We’ll make the rate limiter compatible with any cache backend — Redis, in-memory, Memcached, or even a file-based fallback in the 
future — by making it work through a consistent abstract interface provided by the cache service. This allows low-resource environments 
to still use rate limiting efficiently.
💡 Example Usage Insight
When useCacheBackend is true:

The rate-limiting module/service will get a cache client instance from our global cache module.

If the system is using Redis/Memcached, rate limiting becomes distributed automatically.

If in-memory fallback is used (e.g. for small projects), rate limiting still works but only per instance.

*/