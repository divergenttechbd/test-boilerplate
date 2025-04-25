// src/core/config/cache.config.ts

import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  /**
   * Cache type:
   * - 'system' → In-memory (default)
   * - 'redis' → Redis cache
   * - 'memcached' → Memcached server
   */
  type: (process.env.CACHE_TYPE || 'system').toLowerCase(),

  /**
   * Common TTL (time-to-live) in seconds for all cache items
   */
  ttl: parseInt(process.env.CACHE_TTL, 10) || 300, // default: 5 minutes

  /**
   * Redis config (used when CACHE_TYPE = 'redis')
   */
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },

  /**
   * Memcached config (used when CACHE_TYPE = 'memcached') !!!NOT PREFERRED!!!
   */
  memcached: {
    servers: process.env.MEMCACHED_SERVERS || '127.0.0.1:11211',
    username: process.env.MEMCACHED_USERNAME || '',
    password: process.env.MEMCACHED_PASSWORD || '',
  },
}));

/*
 Purpose: Centralized config for application-wide cache behavior. Supports system, redis, or memcached with fallbacks.
 
⚙️ How to Use in AppModule or CacheModule
ts

import { CacheModule, CacheStoreFactory } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import * as memcachedStore from 'cache-manager-memcached-store';

CacheModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const type = config.get<'system' | 'redis' | 'memcached'>('cache.type');

    if (type === 'redis') {
      const redis = config.get('cache.redis');
      return {
        store: redisStore,
        host: redis.host,
        port: redis.port,
        password: redis.password,
        ttl: config.get<number>('cache.ttl'),
      };
    }

    if (type === 'memcached') {
      const memcached = config.get('cache.memcached');
      return {
        store: memcachedStore,
        servers: memcached.servers,
        username: memcached.username,
        password: memcached.password,
        ttl: config.get<number>('cache.ttl'),
      };
    }

    // Default to in-memory
    return {
      ttl: config.get<number>('cache.ttl'),
    };
  },
  isGlobal: true,
});
✅ Summary of Supported Cache Modes

Mode	Description	Use When
system	In-memory cache (built-in)	Local dev, small-scale prod
redis	Fast, persistent distributed cache	Mid-large scale
memcached	Lightweight distributed cache	If Redis isn't an option


*/
// Note: The above code is a configuration file for a NestJS application that sets up caching options. 

