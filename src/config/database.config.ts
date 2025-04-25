// src/core/config/database.config.ts

import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  /**
   * Database type: can be 'mysql' or 'mssql'
   * This will help us switch between database engines easily
   */
  type: process.env.DB_TYPE || 'mysql', // mysql | mssql
  /**
   * Hostname or IP address of the database server
   */
  host: process.env.DB_HOST || 'localhost',
  /**
   * Port number where the DB is exposed
   * Default for MySQL = 3306, MSSQL = 1433
   */
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  /**
   * Database username
   */
  username: process.env.DB_USERNAME || 'root',
  /**
   * Database password
   */
  password: process.env.DB_PASSWORD || 'root',
  /**
   * Name of the database to connect to
   */
  database: process.env.DB_DATABASE || 'nestjs_boilerplate',
  /**
   * Whether TypeORM should synchronize entities (not recommended for production)
   */
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  /**
   * Enable/disable TypeORM query logging
   */
  logging: process.env.DB_LOGGING === 'true',
  /**
   * Optional: Timezone configuration for MySQL/MSSQL
   */
  timezone: process.env.DB_TIMEZONE || 'Z', // 'Z' = UTC
  
  /**
   * Advanced connection pooling
   */
  pool: {
    /**
     * Initial pool size
     */
    size: parseInt(process.env.DB_CONNECTION_POOL_SIZE, 10) || 10,

    /**
     * Minimum connections in the pool
     */
    min: parseInt(process.env.DB_CONNECTION_POOL_MIN, 10) || 2,

    /**
     * Maximum connections in the pool
     */
    max: parseInt(process.env.DB_CONNECTION_POOL_MAX, 10) || 20,

    /**
     * Max time (ms) to wait for acquiring a connection from pool
     */
    acquireTimeoutMillis:
      parseInt(process.env.DB_CONNECTION_POOL_ACQUIRE_TIMEOUT, 10) || 30000,

    /**
     * Idle timeout (ms) before a connection is released
     */
    idleTimeoutMillis:
      parseInt(process.env.DB_CONNECTION_POOL_IDLE_TIMEOUT, 10) || 60000,

    /**
     * Maximum lifetime (ms) for a single connection
     */
    maxLifetime:
      parseInt(process.env.DB_CONNECTION_POOL_MAX_LIFETIME, 10) || 600000,

    /**
     * Timeout for establishing connection (optional - fails faster if DB is not available)
     */
    connectionTimeoutMillis:
      parseInt(process.env.DB_CONNECTION_POOL_TIMEOUT, 10) || 30000,
  },
}));



/*
⚙️ How to use this config
1️⃣ In TypeOrmModule.forRootAsync() (inside database.module.ts)
ts

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// src/infrastructure/database/database.module.ts

useFactory: async (configService: ConfigService) => {
  const pool = configService.get('database.pool');

  return {
    type: configService.get<'mysql' | 'mssql'>('database.type'),
    host: configService.get('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get('database.username'),
    password: configService.get('database.password'),
    database: configService.get('database.database'),
    synchronize: configService.get<boolean>('database.synchronize'),
    logging: configService.get<boolean>('database.logging'),
    timezone: configService.get('database.timezone'),
    entities: [__dirname + '\/..\/**\/*.entity{.ts,.js}'],

    // Apply pool options
    extra: {
        connectionLimit: pool.max, // MySQL-specific
        acquireTimeout: pool.acquireTimeoutMillis,
        connectTimeout: pool.connectionTimeoutMillis,
        idleTimeoutMillis: pool.idleTimeoutMillis,
        maxLifetime: pool.maxLifetime,
      },
    };
  }
  ✅ Note:
  MySQL uses connectionLimit
  MSSQL uses pool: { min, max, idleTimeoutMillis, ... } — you'll need to map it accordingly.
  
  

🧠 Notes for Production
Set synchronize: false in production, use migrations instead

If MSSQL is chosen, make sure to handle extra: { options: {...} } settings like encrypt

Ensure secure password handling with .env and avoid committing secrets

*/