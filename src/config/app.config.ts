// src/core/config/app.config.ts

import { registerAs } from '@nestjs/config';

// This registers the config under the namespace 'app'
// You can access values like: configService.get('app.port')
export default registerAs('app', () => ({
  /**
   * Application display name
   */
  name: process.env.APP_NAME || 'nestjs-boilerplate',

  /**
   * Current environment: development, production, test, etc.
   */
  env: process.env.NODE_ENV || 'development',

  /**
   * The port your app will run on
   */
  port: parseInt(process.env.PORT, 10) || 3000,

  /**
   * Application version (can be used for Swagger, health, etc.)
   */
  version: process.env.APP_VERSION || '1.0.0',

  /**
   * Global API route prefix (e.g., /api)
   */
  apiPrefix: process.env.APP_GLOBAL_PREFIX || '/api',

  /**
   * API versioning segment (e.g., /api/v1)
   */
  apiVersion: process.env.API_VERSION || 'v1',

  /**
   * Timezone used throughout the app (especially useful for audit logging, date storage, CRON)
   */
  appTimezone: process.env.APP_TIMEZONE || 'UTC',
}));

// This is a configuration file for a NestJS application. It uses the `registerAs` function from the `@nestjs/config` package to 
// create a configuration object that can be accessed throughout the application. The configuration includes various settings such as 
// the application name, environment, port, version, API prefix, and timezone. The values are either taken from environment variables or defaulted 
// to specific values if the environment variables are not set.

/*
    // To Use this  We need to use-
    import { ConfigService } from '@nestjs/config';
    
    const configService = app.get(ConfigService);  // as ConfigService in main.ts
    const timezone = this.configService.get<string>('app.appTimezone');
    const timestamp = dayjs().tz(timezone).format(); // → timestamp in app’s local timezone
*/