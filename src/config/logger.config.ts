// src/config/logger.config.ts

import { registerAs } from '@nestjs/config';

export type LoggerType = 'console' | 'file' | 'loki';
export type LogFormat = 'json' | 'pretty';
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose';

export default registerAs('logger', () => ({
  /**
   * Logger type to use.
   * Options:
   *  - console: Logs to stdout (ideal for local development)
   *  - file: Writes logs to file (dev/UAT/staging)
   *  - loki: Pushes logs to centralized system like Grafana Loki
   */
  type: (process.env.LOGGER_TYPE || 'console') as LoggerType,

  /**
   * Minimum level of logs to capture.
   * Options: error | warn | info | debug | verbose
   */
  level: (process.env.LOGGER_LEVEL || 'debug') as LogLevel,

  /**
   * Timestamp format for log entries.
   * Should be based on process.env.APP_TIMEZONE (default UTC)
   */
  timezone: process.env.APP_TIMEZONE || 'UTC',

  /**
   * Format of logs.
   * - 'json': Structured JSON output
   * - 'pretty': Human-readable format
   */
  format: (process.env.LOGGER_FORMAT || 'pretty') as LogFormat,

  /**
   * Console-specific settings (for local development)
   */
  console: {
    enableColors: process.env.LOGGER_CONSOLE_COLOR === 'true',
  },

  /**
   * File-based logger configuration (for dev logs or UAT/staging)
   */
  file: {
    /**
     * Root path for log files.
     * - In development: logs/ (project root)
     * - In staging/UAT: process.env.FILE_EXTERNAL_BASE_PATH + /logs/
     */
    path:
      process.env.NODE_ENV === 'development'
        ? 'logs'
        : process.env.FILE_EXTERNAL_BASE_PATH
        ? `${process.env.FILE_EXTERNAL_BASE_PATH}/logs`
        : 'logs',

    /**
     * Base filename pattern for logs
     */
    filename: process.env.LOGGER_FILE_NAME || 'application',

    /**
     * Whether to rotate logs daily
     */
    rotate: process.env.LOGGER_FILE_ROTATE === 'true',

    /**
     * Max retention days for rotated logs
     */
    maxDays: parseInt(process.env.LOGGER_FILE_MAX_DAYS || '7', 10),
  },

  /**
   * Grafana Loki (or similar) remote logging config
   */
  loki: {
    host: process.env.LOKI_HOST || '', // Loki push endpoint
    labels: {
      app: process.env.APP_NAME || 'nest-app',
      env: process.env.NODE_ENV || 'development',
    },
    basicAuth: process.env.LOKI_BASIC_AUTH || '', // base64 encoded username:password
  },

  /**
   * Trace tracking - useful for tracing requestId/traceId across lifecycle
   */
  tracing: {
    enable: true,
    requestIdHeader: 'x-request-id', // default header to extract requestId
    traceIdHeader: 'x-trace-id', // optional additional tracing
    injectContext: true, // Attach to each log entry
  },

  /**
   * Enable manual log calls
   */
  manualLogging: true,
}));


/*
✅ Goals

Feature	             Supported?	          Notes
Console/File/Grafana support	✅	Dynamically selected based on env
Trace ID & Request ID	✅	Can be passed with each log
Rotating log files	✅	Log rotation for file logging
JSON/Pretty log format	✅	Useful for structured logging
Log level control	✅	debug, info, warn, error etc.
Performance optimized	✅	Uses async non-blocking writes
Environment aware	✅	Mode specific default setup

📌 Usage Strategy (Programmatic)
The logger setup can be handled using LoggerService and integrated with:

Trace Middleware to pass traceID & requestID

Logger Interceptors for contextual logging

Logger Providers to connect with Grafana via Loki HTTP API or Winston Loki Transport

🧠 Best Practice

Env	Recommended       Output	         Why
Development	    Console + Pretty	Human-readable, fast iteration
UAT	               File logging 	Local persistence, easy to inspect logs
Production	       Grafana / Loki	  Centralized logging, analytics & observability


🧠 Key Capabilities & Behavior

Feature	                        Explanation
Console Logging	            Colorized output for fast feedback during development
File-based Logging	           Persistent logs stored at logs/ or custom paths, with rotation support
Grafana Loki (Remote Logging)	Push logs to centralized system with labels for filtering and analysis
RequestID & TraceID Propagation	    Supports tracing request flow across services with headers and context
Timezone Awareness	            All logs timestamped using UTC (or configured timezone)
Log Format Options          	Choose between structured JSON or pretty-printed logs
Manual Logging Support	        Built-in support for writing logs programmatically (e.g. audit logs)
Secure and Configurable	    All values injected through environment variables for full environment control

🔐 Security, Scalability & Availability

Mode	    Scalability 	                Availability	              Security Support
Console	    Low (for dev only)	            Local only	                             N/A
File	    Moderate (good for batch/rotation)	Local/host-mount-based	    File permissions
Loki	    High (centralized aggregation)	High availability via clusters	A   uth, TLS, Grafana ACLs

🧰 Use Inside Logger Module
You can now inject and use the config like so:

```ts
import { ConfigType } from '@nestjs/config';
import loggerConfig from 'src/config/logger.config';

@Injectable()
export class LoggerService {
  constructor(
    @Inject(loggerConfig.KEY)
    private readonly config: ConfigType<typeof loggerConfig>,
  ) {
    console.log('Logger initialized with type:', this.config.type);
  }
}

📥 Integration Inside App
```ts
import { ConfigType } from '@nestjs/config';
import loggerConfig from 'src/config/logger.config';

@Injectable()
export class SomeService {
  constructor(
    @Inject(loggerConfig.KEY)
    private readonly loggerCfg: ConfigType<typeof loggerConfig>,
  ) {}

  logSomething() {
    console.log(`[${this.loggerCfg.level}] Log something important!`);
  }
}

*/