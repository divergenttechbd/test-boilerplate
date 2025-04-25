
---

## `Project-root/` Directory structure

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

# #Directory Explation

---

## 📁 `src/common/` – Shared Layer Documentation

```markdown
# 🧰 common/

The `common/` directory contains reusable, shared logic that is **agnostic of domain logic**. These building blocks can be used across all modules for consistency and maintainability.

It follows **DRY (Don't Repeat Yourself)** and **Separation of Concerns (SoC)** principles.

---

## 📁 decorators/

Custom NestJS decorators that wrap common behaviors, metadata, or context extraction.

### Examples:
- `@CurrentUser()` – Injects currently authenticated user from request.
- `@Roles()` – Define role-based access metadata.
- `@Trace()` – Attaches traceId to internal logs/methods.

> ✅ These improve **code readability**, **avoid boilerplate**, and **centralize logic**.

---

## 📁 dtos/

Globally shared DTOs (Data Transfer Objects). These include request validation shapes and utility data schemas used across modules.

### Examples:
- `PaginateDto` – Shared for all paginated API endpoints.
- `DateRangeDto` – Reusable for filter-based modules.

> 📦 DTOs in this folder are imported in **many modules**. They should not include domain-specific logic.

---

## 📁 exceptions/

Custom exception classes and global filters that extend NestJS's HTTP Exception system.

### Includes:
- `AppExceptionFilter` – Centralized error formatting and logging.
- `CustomHttpException` – Base class for all custom errors.
- `DatabaseException`, `ValidationException`, etc.

> 🚨 Improve error consistency, traceability, and developer experience.

---

## 📁 guards/

Authentication/authorization guards to protect routes and services.

### Examples:
- `PermissionsGuard` – Uses `@Permissions()` decorator + RBAC metadata.
- `TenantGuard` – Validates current tenant scope.
- `RateLimitGuard` – Optional global/per-user rate-limiting.

> 🛡️ Always keep **lightweight logic** here and delegate checks to services if complex.

---

## 📁 interceptors/

Useful for modifying request/response cycles, performance monitoring, logging, etc.

### Examples:
- `LoggingInterceptor` – Attaches logs to each request/response.
- `TimeoutInterceptor` – Sets global/external timeout on requests.
- `TransformInterceptor` – Formats all successful responses.

> 🔁 Interceptors are global middleware-style hooks. Reusable and powerful.

---

## 📁 interfaces/

Custom types/interfaces used across modules and system layers.

### Examples:
- `Paginated<T>` – Response structure for paginated lists.
- `RequestContext` – Extended request with user, traceId, tenant, etc.

> 🧬 Centralized definitions make code safer and easier to refactor.

---

## 📁 middleware/

Custom NestJS middleware functions.

### Examples:
- `trace.middleware.ts` – Generates and attaches `traceId`, `requestId`.
- `request-context.middleware.ts` – Injects context for all layers.

> 🔀 Applied globally in `main.ts` or bootstrap logic for consistent behavior.

---

## 📁 pipes/

Validation and transformation pipes that plug into request pipelines.

### Examples:
- `ParseObjectIdPipe`
- `TransformBooleanPipe`
- `ValidationPipe` (Customized version)

> 🧹 Use to enforce strong data consistency before controller/service logic.

---

## 📁 utils/

Helper functions, constants, converters that are pure, side-effect free, and highly reusable.

### Examples:
- `string.utils.ts` – slugify, capitalize, truncate
- `date.utils.ts` – parse, format, timezone-safe
- `file.utils.ts` – MIME detection, extension parsing

> 🛠 Use these across the entire codebase. No dependencies on NestJS or DB.

---

## 📁 file-manipulation/

Specialized utilities for generating/manipulating files: PDFs, Excel, images, etc.

### Includes:
- `pdf.service.ts` – PDFKit based document generation
- `excel.util.ts` – ExcelJS worksheet handling
- `image.util.ts` – Image resize, crop (via Sharp)

> 🖨️ These are used by job processors, reporting modules, and admin panels.

---

## ✅ Best Practices

- 🔄 All helpers should be **pure** unless explicitly stateful.
- 🌐 Avoid importing `@nestjs/*` inside utils – keep decoupled.
- 🧪 Write tests for custom pipes, exceptions, and decorators.
- 📦 Never couple `common/` with specific business logic (`users/`, `roles/`, etc.)

---

## ✅ Usage Example

In a controller:

```ts
@UseGuards(PermissionsGuard)
@Permissions('user.read')
@Get('me')
getMe(@CurrentUser() user: UserEntity) {
  return user;
}
```

In a service:

```ts
import { slugify } from '@/common/utils/string.utils';

const slug = slugify(title);
```

---

```

