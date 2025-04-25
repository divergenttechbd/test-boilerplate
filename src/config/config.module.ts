
// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import authConfig from './auth.config';
import cacheConfig from './cache.config';
import fileConfig from './file.config';
import loggerConfig from './logger.config';
import notificationConfig from './notification.config';
import databaseConfig from './database.config';
import eventStreamConfig from './event-stream.config';
import externalApiConfig from './external-api.config';
import mailConfig from './mail.config';
import messageBrokerConfig from './message-broker.config';
import queueConfig from './queue.config';
import rabbitmqConfig from './rabbitmq.config';
import rateLimitConfig from './rate-limit.config';
import smsGatewayConfig from './sms-gateway.config';
import sseConfig from './sse.config';
import swaggerConfig from './swagger.config';
import websocketConfig from './websocket.config';


@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [
        appConfig,
        authConfig,
        cacheConfig,
        fileConfig,
        loggerConfig,
        notificationConfig,
        queueConfig,
        rabbitmqConfig,
        sseConfig,
        eventStreamConfig,
        swaggerConfig,
        databaseConfig,
        mailConfig,
        rateLimitConfig,
        smsGatewayConfig,
        externalApiConfig,
        messageBrokerConfig,
        websocketConfig,
      ],
      isGlobal: true, // Makes the ConfigService globally accessible
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}





/*
The config.module.ts file is a critical piece of your NestJS project as it integrates and loads all the configurations that you've defined across various configuration files into the application. Its role is to provide centralized configuration management and make sure that the configurations are available throughout the application.

Purpose:
1. Centralized Configuration Management: It acts as a hub where all configuration files (like app.config.ts, auth.config.ts, database.config.ts, etc.) are imported and available to all modules.
2. Environment-based Configuration: It allows loading of environment variables through the ConfigService, making configurations dynamic based on the environment (development, production, etc.).
3. Dependency Injection: With NestJS's built-in DI system, it ensures that all services that need specific configurations can easily access them.
4. Scalability and Maintainability: Instead of manually importing and managing each configuration across all files and services, you only need to reference the ConfigService.

Steps for Implementation:
1. Install Dependencies: You'll need the @nestjs/config package, which provides a centralized configuration service.
bash
npm install @nestjs/config

2. Import and Setup: You'll need to create a ConfigModule that will provide configuration functionality for the entire app. This module will load all your configuration files and provide them via the ConfigService.


Key Elements:
- NestConfigModule.forRoot(): This method is called to load all configuration files into the NestJS app. The load array is where you specify all the configuration files that you want to use in the app.
- isGlobal: By setting isGlobal: true, you make the ConfigService available globally across the application, so you don't need to import ConfigModule in every other module.
- exports: This allows the NestConfigModule to be available to other modules in the application.


How to Use ConfigModule in Other Modules:
Once the ConfigModule is set up, you can inject the ConfigService into any other module or service to access the configuration values.

For example, in a service or controller:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getConfig() {
    // Access configuration values like so
    const dbHost = this.configService.get<string>('database.host');
    console.log('Database Host:', dbHost);
  }
}
  ```
Final Notes:
- The ConfigService is a simple way to manage your environment-specific configurations.
- It ensures that you can easily manage and access configurations without hardcoding values throughout your app.
- Once all configurations are centralized and exported, the app's maintainability and scalability are enhanced.

*/