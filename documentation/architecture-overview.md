---
#Table of contents

1. Overview
2. Project Structure
3. Configuration Strategy
4. Core Modules
5. Infrastructure Modules
6. Logging, Monitoring, Alerting
7. Exception Handling
8. Queue & Jobs Strategy
9. File Handling Strategy
10. Notification Strategy
11. Testing Strategy
12. Bootstrapping DB Assets (triggers, views, etc.)
13. Deployment & Environment Guidelines
14. Security Best Practices
15. Future Considerations

## 1. Overview

This document outlines the architecture, design principles, and implementation strategies for our NestJS-based backend system. It serves as a comprehensive guide for developers, DevOps, and stakeholders, ensuring consistency and clarity throughout the project's lifecycle.

---

## 2. Project Structure

Our project follows a modular and scalable structure, promoting separation of concerns, reusability, and maintainability

### ✅ **NestJS application Directory Structure**

```bash
📦 project-root/
├── 📁 src/                  # Main application 
│   ├── 📄 main.ts                      # App entrypoint: loads env, bootstraps app
│   ├── 📄 app.module.ts               # Root NestJS AppModule
│   │
│   ├── 📁 assets/                   # App assets (persistent/local)
│   │   ├── 📁 upload/                # All uploaded files from user. This should be persistent.
│   │   ├── 📁 generated/              # 🛠️ System-generated files (reports, temp exports). This should delete after 24 hours for file creation.
│   │   ├── 📁 jobs/                   # 📋 Persistent queue-based jobs (used in FILE queue driver)
│   │   ├── 📁 queue-persistence/      # 🧩 Job persistence for local-queue fallback. 
│   │   └── 📁 static/                 # 🖼️ Static resources (banners, logos, templates)
│   │
│   ├── 🧰 common/                  # Shared, reusable logic across modules
│   │   ├── 📁 decorators/             # 🏷️ Custom decorators (e.g., @CurrentUser)
│   │   ├── 📁 dtos/                   # 📦 Shared DTOs (e.g., PaginateDto)
│   │   ├── 📁 enums/                   # 📘 Shared enums used across modules
│   │   ├── 📁 guards/                 # 🛡️ Permission, tenant guards
│   │   ├── 📁 interceptors/           # 🔁 Logging, transformation, timeout interceptors
│   │   ├── 📁 interfaces/             # 🧬 Shared types and interfaces
│   │   ├── 📁 middleware/             # 🔀 Custom middleware (traceId, requestId, logger)
│   │   ├── 📁 exceptions/             # 🚨 Global exception filters and classes
│   │   ├── 📁 transformers/            # 🔁 Used to convert output DTOs or database entities to a final response format.
│   │   ├── 📁 pipes/                  # 🧹 Custom validation/transformation pipes
│   │   ├── 📁 utils/                  # 🛠️ Pure utility/helper functions (string, time, etc.)
│   │   └── 📁 file-manipulation/      # 🗃️ Sharp, ExcelJS, Microsoft Word(docxtemplater pizzip, html-docx-js), PDFKit wrappers
│   │
│   ├── ⚙️ config/                 # All environment-specific configuration
│   │   ├── 📄 app.config.ts
│   │   ├── 📄 auth.config.ts
│   │   ├── 📄 cache.config.ts
│   │   ├── 📄 config.module.ts
│   │   ├── 📄 event-stream.config.ts
│   │   ├── 📄 external-api.config.ts
│   │   ├── 📄 file.config.ts
│   │   ├── 📄 kafka.config.ts
│   │   ├── 📄 logger.config.ts
│   │   ├── 📄 mail.config.ts
│   │   ├── 📄 message-broker.config.ts
│   │   ├── 📄 notification.config.ts
│   │   ├── 📄 queue.config.ts
│   │   ├── 📄 rate-limit.config.ts
│   │   ├── 📄 sms-gateway.config.ts
│   │   ├── 📄 sse.config.ts
│   │   ├── 📄 swagger.config.ts
│   │   ├── 📄 websocket.config.ts
│   │   └── 📄 validation.config.ts
│   │   └── ...
│   │
│   ├── 🔧 core/                    # System-level concerns: logging, lifecycle, etc.
│   │   ├── ⚡ bootstrap/             #  Initialization logic broken by concern
│   │   │   ├── 📄 core.bootstrap.ts         # Pipes, filters, interceptors
│   │   │   ├── 📄 cors.bootstrap.ts         # CORS setup
│   │   │   ├── 📄 env.bootstrap.ts         # env file setup
│   │   │   ├── 📄 compression.bootstrap.ts  # gzip compression
│   │   │   ├── 📄 helmet.bootstrap.ts       # Security headers
│   │   │   ├── 📄 lifecycle.bootstrap.ts    # Graceful shutdown (onModuleDestroy)
│   │   │   ├── 📄 signal.bootstrap.ts       # SIGINT/SIGTERM handler (process signal)
│   │   │   ├── 📄 swagger.bootstrap.ts      # Swagger docs setup
│   │   │   └── 📄 trace.middleware.ts       # TraceId, RequestId middleware
│   │   │   └── ...
│   │   │
│   │   ├── 📁 security/                # Helmet, rate limiter, IP blocking middleware
│   │   │
│   │   ├── 📁 monitoring/             # Prometheus / OpenTelemetry metrics exporters
│   │   │
│   │   ├── 📚 validation/            #  Centralized validation pipes, schemas, DTO guards
│   │   │
│   │   ├── 📚 constants/            #  Central place for constants, organized per domain (auth, db, queue, etc.)
│   │   │   ├── 📄 db.constants.ts
│   │   │   ├── 📄 file.constants.ts
│   │   │   ├── 📄 queue.constants.ts
│   │   │   └── ...
│   │   │
│   │   ├──🩺 health-check/              # Health check endpoints and providers for readiness/liveness probes. For self-monitoring.
│   │   │   └── 📄 health.module.ts
│   │   │
│   │   └── 📜 logger/              # Unified logging mechanism, manual + auto logging, Request Lifecycle tracing, support for Loki, console, and file modes. 
│   │
│   ├── 🏗️ infrastructure/        # Abstracted, pluggable core infra logic
│   │   ├── 📁 database/               # Database integration
│   │   │   ├── 📁 migrations/          # SQL and TypeORM-based migrations
│   │   │   ├── 📁 seeders/
│   │   │   ├── 📁 sql/                       # 💡 Grouped: procedures, events, triggers, views
│   │   │   │   ├── 📁 procedures/          # Stored procedures code
│   │   │   │   ├── 📁 triggers/            # DB triggers script
│   │   │   │   ├── 📁 events/            # DB events script
│   │   │   │   └── 📁 views/               # DB views script
│   │   │   ├── 📁 entities/                  # 🧱 Base + common TypeORM entities
│   │   │   └── 📄 database.module.ts
│   │   ├── 📁 cache-core/            # Unified cache API (memory, Redis, etc.)
│   │   ├── 📁 file-storage-core/     # Unified file upload/download (S3/local/etc.)
│   │   ├── 📁 message-broker-core/   # Kafka/NATS/AMQP abstraction
│   │   ├── 📁 notifier-core/         # Email/SMS/Web/Push notification backend
│   │   ├── 📁 audit-log/             # System Wide Audit Logging with interceptor & services, decorator
│   │   └── 📁 queue-core/            # Queue driver abstraction (Redis, local FS fallback)
│   │
│   ├── 🧩 modules/               # API-facing business logic (auth, users, etc.)
│   │   ├── 📁 users/                 # 👤 User CRUD, profile management
│   │   ├── 📁 roles/                 # 🔑 Role management
│   │   ├── 📁 permissions/           # 🛡️ Fine-grained permission control
│   │   ├── 📁 auth/                  # Auth + refresh token + strategy, guards, interceptors, permission check, Access 
│   │   ├── 📁 settings/              # ⚙️ Admin/system-wide settings
│   │   ├── 📁 notifications/         # User-facing notification history and status
│   │   └── ...
│   │
│   ├── ⏱️ scheduler/             # Cron jobs, queue workers, retry strategies
│   │   ├── 🏭 queue-workers/        #  Queue-based background processors
│   │   ├── ⏲️ cron/                  #  Scheduled periodic jobs (e.g., via node-cron
│   │   ├── 📁 processors/            # Reusable processors used in multiple workers
│   │   └── 📁 strategies/            # Retry strategies, exponential backoff
│   │
│   ├── 🕸️ gateways/              This directory handles all **real-time communication layers** in your application. It supports a **registry-based pattern** to dynamically register handlers, providing strong decoupling and extensibility.
│   │   ├── 📁 client-gateway/                # WebSocket/SSE client connections
│   │   ├── 📁 inter-service-gateway/         # Microservice message gateways
│   │   ├── 📁 intra-service-gateway/         # Internal event bus gateways (e.g., EventEmitter2)
│   │   └── 📄 event-registry.ts      # Registry pattern for event binding
├── 🔌 scripts/                        # Utility scripts (seeding, backups, tasks)
├── 📁 test/                           # Unit & E2E tests
│   ├── 📁 unit/            # Reusable processors used in multiple workers
│   └── 📁 e2e/
├── 🐙 .github/                     # GitHub workflows & issue templates
│   └── 📂 workflows/
│       ├── ⚙️ ci.yml               # CI workflow for building and testing
│       └── ⚙️ cd.yml                # CD workflow for deployment
├── 🧪 .env                          # Main environment file
├── 🧪 .env.example                  # Example env config for documentation
├── 🧪 .env.development             # Development-specific environment variables
├── 🧪 .env.production              # Production-specific environment variables
├── 🧪 .env.staging                 # Staging-specific environment variables
├── 📄 .eslintignore                # ESLint ignore rules
├── 📄 .eslintrc.js                 # ESLint configuration
├── 📄 .prettierrc                  # Code formatting rules
├── 🧾 commitlint.config.js         # Enforce commit message convention
├── 🧾 lint-staged.config.js        # Lint staged files before committing
├── 🐳 Dockerfile                   # Docker build instructions
├── 🐳 .dockerignore                # Ignore files for Docker context
├── 🧰 nest-cli.json                # NestJS CLI configuration
├── 🧰 tsconfig.json                # TypeScript configuration
├── 🧰 tsconfig.build.json          # TypeScript build config
├── 📜 package.json                 # Project dependencies and scripts
└── 📘 README.md                    # Project documentation root
```

---

### 🧩 Key notes

- 🔁 **`core/`**: Isolated project-wide bootstrapping, constants, logging, and config.
- 🏗️ **`infrastructure/`**: Technology stack & integrations (db, redis, jobs, etc.).
- 🔁 **`application/`**: Cleanly separated business logic — easy to test and maintain.
- 🧠 **`shared/`**: Cross-cutting concerns reused everywhere.
- ⚡ **`gateways/`** moved inside `application/` where it belongs — clean and domain-aligned.

- `api/` will hold domain-specific features (user, auth, profile, etc.).
- `notification/` is standalone & event-driven, can operate via emitter or external broker.
- `bootstrap/` isolates main.ts complexity for maintainability.
- `database/` supports raw SQL features (procs, triggers, views) alongside TypeORM.
- `audit-log/` will track every system user action.
- `logger/` will be designed to support console (dev), file (test/stage), and Grafana Loki (prod).
- `config/` will have separate files per system, loaded via a config module.
- `queue/` and jobs/ will define producers and consumers for background tasks.
- Docker setup will allow plugging in either MySQL or MSSQL using .env.

---

# 📘 ARCHITECTURE.md

---

### 📁 `src/`

- **`main.ts`** Application entry point; initializes the app and global configuration.
- **`app.module.ts`** Root module that imports and configures all other module.

### 📁 `assets/`

- **`upload/`*: Stores user-uploaded files; persistent storae.
- **`generated/`*: Holds system-generated files (e.g., reports); files are auto-deleted after 24 hous.
- **`jobs/`*: Persistent storage for queue-based jobs, especially when using a file-based queue drivr.
- **`queue-persistence/`*: Stores job data for local-queue fallback mechaniss.
- **`static/`*: Contains static resources like banners, logos, and templats.

### 📁 `common/`

- **`decorators/`*: Custom decorators (e.g., `@CurrentUser`) for enhancing functionalty.
- **`dtos/`*: Shared Data Transfer Objects used across modues.
- **`enums/`*: Shared enumerations for consistent value definitins.
- **`guards/`*: Authorization and permission guads.
- **`interceptors/`*: Interceptors for logging, transformation, and timeout handlng.
- **`interfaces/`*: Shared interfaces and type definitins.
- **`middleware/`*: Custom middleware like `traceId`, `requestId`, and loggng.
- **`exceptions/`*: Global exception filters and custom exception clases.
- **`transformers/`*: Utilities to transform output DTOs or database entities to response formts.
- **`pipes/`*: Custom validation and transformation pies.
- **`utils/`*: Utility functions for strings, time, tc.
- **`file-manipulation/`*: Wrappers for file operations using libraries like Sharp, ExcelJS, PDFKit, tc.

### 📁 `confi/`

Contains environment-specific configuratons:

- **`app.config.ts**: General application settngs.
- **`auth.config.ts**: Authentication-related configuratons.
- **`cache.config.ts**: Caching strategies and settngs.
- **`event-stream.config.ts**: Event streaming configuratons.
- **`external-api.config.ts**: External API integratons.
- **`file.config.ts**: File handling configuratons.
- **`kafka.config.ts**: Kafka messaging configuratons.
- **`logger.config.ts**: Logging settngs.
- **`mail.config.ts**: Email service configuratons.
- **`message-broker.config.ts**: Message broker settngs.
- **`notification.config.ts**: Notification service configuratons.
- **`queue.config.ts**: Queue management settngs.
- **`rate-limit.config.ts**: Rate limiting configuratons.
- **`sms-gateway.config.ts**: SMS gateway settngs.
- **`sse.config.ts**: Server-Sent Events configuratons.
- **`swagger.config.ts**: Swagger documentation settngs.
- **`websocket.config.ts**: WebSocket configuratons.
- **`validation.config.ts**: Validation rules and settngs.

### 📁 `coe/`

System-level conerns:

- **`bootstrap`**: Initialization logic, including CORS, environment setup, compression, security headers, lifecycle events, signal handling, Swagger setup, and trace middlware.
- **`validation`**: Centralized validation pipes, schemas, and DTO gards.
- **`constants`**: Central place for constants, organized per domain (auth, db, queue, tc.).
- **`health-check`**: Health check endpoints and providers for readiness/liveness pobes.
- **`logger`**: Unified logging mechanism supporting various transports like Loki, console, and iles.
- **`security`**: Security middlewares and services, including Helmet for setting HTTP headers, rate limiting, and IP blackliting.
- **`monitoring`**: Prometheus metrics exporters and monitoring integraions.

### 📁 `infrastructre/`

Abstracted, pluggable core infrastructurelogic:

- **`databas/`**: Database integration, including migrations, seeders, SQL scripts (procedures, triggers, events, views), and enities.
- **`cache-cor/`**: Unified cache API supporting memory, Redi, etc.
- **`file-storage-cor/`**: Unified file upload/download mechanisms (S3, local,etc.).
- **`message-broker-cor/`**: Abstractions for Kafka, NATS, AMQ, etc.
- **`notifier-cor/`**: Email, SMS, Web, and Push notification bakends.
- **`audit-lo/`**: System-wide audit logging with interceptors, services, and decoators.
- **`queue-cor/`**: Queue driver abstractions supporting Redis, local FS fallbac, etc.

---

### 📁 `modules/`

> This directory contains **feature modules**. Each module encapsulates related business logic, controllers, services, DTOs, and repositories.

#### 🌐 Core Modules

- **`auth/`**  
  Handles login, registration, token generation, refresh logic, and authentication guards.

- **`user/`**  
  Manages user-related operations like profile, settings, and status.

- **`role/` & `permission/`**  
  Role-based access control (RBAC) using decorators and policies (e.g., CASL-style).  
  Includes policy handlers, guards, decorators like `@Roles`, `@Permissions`.

#### 🛡️ System Modules

- **`audit/`**  
  Captures and stores system events like login, CRUD, file operations. Supports searchable logs for admin and compliance.

- **`notification/`**  
  In-app, email, SMS, push notifications. Built with failover, retry, and delivery tracking.

- **`gateway/`**  
  WebSocket or SSE-based real-time module for things like notifications or live user activity tracking.

- **`jobs/`**  
  Handles background processing (e.g., report generation, email/SMS sending, long-running tasks). Queue driver abstracted.

#### 💼 Feature Modules (Examples)

- **`product/`, `order/`, `invoice/`**, etc.  
  Business-specific features, each in their own self-contained module with:
  - `controllers/`
  - `services/`
  - `dtos/`
  - `entities/`
  - `repositories/`
  - `policies/` (optional)
  - `guards/` (optional)

> 🧩 **Modular First Design**:  
> Each module is registered independently and can be reused, lazy-loaded, or versioned as needed.

---

## 3. Configuration Strategy

- All configurations live in `config/` and are auto-loaded using the global `ConfigModule`.
- Different `.env` files for each environment: `.env.development`, `.env.staging`, `.env.production`
- Configurations are **strongly typed** and follow NestJS best practices with factory functions.

> 📌 All configs must be injected via `@Inject(ConfigService)` or `@Inject(CONFIG_TOKEN)` to promote loose coupling.

---

## 4. Logging Strategy

- Console logs in development
- File-based logs in staging/UAT (`/var/logs` or custom path)
- Loki + Grafana for production observability
- All logs enriched with:
  - `traceId`, `requestId`
  - `userId`, `ipAddress`, `userAgent`
  - `context`, `action`, `duration`, `status`

> Custom logger wraps NestJS logger and supports `debug/info/warn/error/fatal` levels with structured JSON outputs.

---

## 5. Request Tracing

- Middleware and Interceptor generate and propagate `traceId` and `requestId` per request.
- These IDs travel across:
  - Middleware ➝ Guards ➝ Interceptors ➝ Services ➝ Events ➝ Gateways ➝ DB ➝ FileSystem ➝ Queues ➝ Notifications
- Helps with debugging, tracing logs, and identifying bottlenecks.

---

## 6. Exception & Response Handling

- Global Exception Filter handles all uncaught exceptions.
- Common response format enforced via interceptor:

  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": { ... },
    "meta": { ... }
  }
  ```

> All responses and exceptions follow a **contract-first** principle.

---

## 7. API Documentation

- Swagger auto-generated via `swagger.bootstrap.ts`
- Grouped by tags (modules)
- JWT token support for testing authorized endpoints
- Available only in `development` and `staging` environments

---

## 8. Health Checks & Monitoring

- `/health` endpoint returns DB, cache, queue, and disk status.
- Prometheus metrics at `/metrics` for Grafana
- Readiness and liveness probes compatible with Kubernetes

---

## 9. File Storage Strategy

- **Development**: Local storage (`assets/uploads/`, `assets/generated/`)
- **UAT/Testing**: External mounted path (configured)
- **Production**: S3 or DigitalOcean Spaces
- Files optionally stored:
  - date-wise (e.g., `2025/04/23/`)
  - resource-wise (e.g., `users/profile-pics/`)

> System-generated files in `assets/generated/` are cleaned up via scheduled jobs every 24 hours (configurable).

---

## 10. Queueing Strategy

- Unified queue abstraction over:
  - Redis
  - RabbitMQ
  - File-based local persistent queue (fallback)
- Jobs stored in `assets/jobs/` or external path (`FILE_EXTERNAL_BASE_PATH/jobs/`) in UAT/PROD
- Consistent usage across channels (mail, SMS, push, file jobs)

---

## 11. Notification System

- Channels: Email, SMS, In-App, Webhook, Push, Social (WhatsApp, Discord, Slack, etc.)
- Toggle notifications globally or per-channel
- Configurable retry, queue assignment, and failover mechanism
- Delivery logs and status tracking supported

---

## 12. Deployment & Environment Strategy

- Environment-specific `.env.*` files
- CI/CD through GitHub Actions
- Dockerfile and `docker-compose.yml` included for local + UAT testing
- Support for cloud deployment with NGINX reverse proxy, PM2 or systemd process manager

---
Great! Let's wrap up the `ARCHITECTURE.md` with final sections that cover development practices, testing strategy, future roadmap, and contribution guidelines:

---

## 13. Development Best Practices

### ✅ Coding Guidelines

- Follow [NestJS official style guide](https://docs.nestjs.com).
- Use **dependency injection** and favor interfaces over direct class imports.
- Avoid business logic in controllers – push it to services or use-case classes.
- Group logic in domain-oriented modules.
- Use `@nestjs/config` for all environment-specific behavior.
- Prefer **async/await** over `.then()` for readability and traceability.
- Strictly typed DTOs and interfaces using class-validator and class-transformer.

### 🧼 Code Quality

- **Linting**: ESLint with custom rules
- **Formatting**: Prettier auto-formatting
- **Hooks**: Husky + lint-staged for pre-commit checks
- **Commit Convention**: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- **Auto Documentation**: Swagger and inline TSDoc

---

## 14. Testing Strategy

| Layer        | Type                   | Tools                       |
|-------------|------------------------|-----------------------------|
| Unit        | Pure function testing  | Jest                        |
| Integration | Service + DB           | Supertest + TypeORM + Jest |
| E2E         | API-level testing      | Supertest + Jest            |
| Load        | Performance testing    | Artillery, K6               |

- Mock external services (queues, mailers, Redis) during tests
- Seed data fixtures for DB tests
- Use `.env.test` for isolated test config

---

## 15. CI/CD Strategy

- **CI**:  
  GitHub Actions to run tests, lint, and build for PRs

- **CD**:  
  Optional pipelines per environment (Docker, Kubernetes, or plain SSH)

- Environment-specific deployment scripts with pre/post hooks
- Artifact caching (e.g., `node_modules`, `dist/`)

---

## 16. Roadmap

| Phase | Feature                        | Status       |
|-------|--------------------------------|--------------|
| 1     | Core Auth/User/Roles Modules   | ✅ Completed |
| 2     | Config, Logging, Caching       | ✅ Completed |
| 3     | File Uploads & Notifications   | ✅ Completed |
| 4     | Background Jobs, SSE/WebSocket | 🔄 In Progress |
| 5     | Multi-tenant support           | ⏳ Planned   |
| 6     | Versioned APIs & Admin Panel   | ⏳ Planned   |

---

## 17. Contribution Guidelines

- Clone the repo and run `npm install`
- Use `npm run start:dev` for development
- Follow module scaffolding pattern (`nest g module <name>`)
- Write unit tests before pushing
- PRs should:
  - Pass all tests and lint checks
  - Include Swagger updates (if applicable)
  - Update `CHANGELOG.md` (optional)

> 📬 For major changes or feature proposals, open an issue first to discuss the scope and design.

---

## 18. Resources

- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [Docker Docs](https://docs.docker.com)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Jest](https://jestjs.io/)
- [Grafana & Loki](https://grafana.com/oss/loki/)

---

## ✅ Conclusion

This architecture is built with **scalability, observability, and maintainability** in mind. Whether you're working on a monolith or preparing for microservice extraction later, this foundation supports production-grade use cases from day one.

---

Would you like to generate a `README.md` now that reflects this structure (with simplified project overview, setup, and usage)? Or want a diagram for visualizing the architecture first?
