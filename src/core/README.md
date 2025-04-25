Great! Let’s dive into the next crucial part of your NestJS architecture:

---

## 📁 `src/core/` – Core Application Infrastructure

```markdown
# 🧩 core/

The `core/` folder contains critical setup code responsible for initializing the application, handling cross-cutting concerns, and wiring system-level features like logging, bootstrapping, validation, health checks, and more.

It is the "engine room" that gets things started and ensures enterprise-grade structure.

---

## 📂 Subfolders

| Folder | Purpose |
|--------|---------|
| `bootstrap/` | Modular bootstrapping logic: CORS, compression, security, signal handling, Swagger, etc. |
| `logger/` | Unified logging mechanism, manual + auto logging, support for Loki, console, and file modes |
| `validation/` | Centralized validation pipes, schemas, DTO guards |
| `health/` | Health check endpoints and providers for readiness/liveness probes |
| `constants/` | Central place for constants, organized per domain (auth, db, queue, etc.) |

---

## 📁 bootstrap/

```ts
src/core/bootstrap/
├── compression.bootstrap.ts     // Enables response compression
├── core.bootstrap.ts            // Main core system bootstrapping (helmet, validation, etc.)
├── cors.bootstrap.ts            // Configurable CORS policy
├── lifecycle.bootstrap.ts       // Hooks for lifecycle: shutdown, app signals
├── swagger.bootstrap.ts         // Swagger/OpenAPI documentation setup
├── trace.middleware.ts          // Middleware for traceId/requestId
```

✅ **Purpose**: These files modularize boot logic so `main.ts` stays clean and readable.

Example usage in `main.ts`:
```ts
await bootstrapCore(app);
await bootstrapCors(app);
await bootstrapSwagger(app);
```

---

## 📁 logger/

```ts
src/core/logger/
├── logger.module.ts             // Provides logger globally
├── logger.service.ts            // Unified LoggerService with methods: log(), warn(), error(), etc.
├── logger.interceptor.ts        // Automatically logs all incoming/outgoing HTTP lifecycle
├── logger.utils.ts              // Helpers like formatters, extractors, serializers
├── transports/
│   ├── console.transport.ts     // Console logger setup
│   ├── file.transport.ts        // File-based logger setup
│   └── loki.transport.ts        // Loki integration for observability
```

✅ **Features**:
- Logs traceId, requestId, IP, userAgent, userId if available
- Auto logs request-response lifecycle via interceptor
- Manual logs via `loggerService.info()`, etc.
- Custom format and serialization
- Pluggable transports: file, console, Loki, future-proof for other providers

---

## 📁 validation/

```ts
src/core/validation/
├── validation.pipe.ts           // Global pipe for DTO validation using class-validator
├── schema/
│   ├── user.schema.ts           // Joi or Zod schemas (if needed)
├── decorators/
│   ├── IsPasswordStrong.ts      // Custom validation decorators
│   └── Match.ts                 // e.g. Confirm Password == Password
```

✅ **Features**:
- Custom reusable decorators
- Centralized validation pipe setup (globally applied in `main.ts`)
- Schema support if class-validator is extended with Zod or Joi

---

## 📁 health/

```ts
src/core/health/
├── health.module.ts             // Registers all health indicators
├── health.controller.ts         // `/health` and `/ready` endpoints
├── indicators/
│   ├── db.health.ts             // Checks DB connection
│   ├── redis.health.ts          // Checks Redis availability
│   ├── s3.health.ts             // Checks S3 bucket access
│   └── queue.health.ts          // Checks queue system status
```

✅ **Features**:
- Used for Kubernetes / Docker / Load Balancer probes
- Extensible to any external/internal system
- Works with `@nestjs/terminus`

Example:
```ts
GET /health       -> All systems
GET /ready        -> Readiness probe for deployment
```

---

## 📁 constants/

```ts
src/core/constants/
├── app.constants.ts
├── db.constants.ts
├── queue.constants.ts
├── message-broker.constants.ts
├── auth.constants.ts
```

✅ **Why Split**:
- Better traceability
- Aligned with config modules
- Reduces magic strings

Example:
```ts
export const DEFAULT_ROLE = 'user';
export const MAX_RETRIES = 3;
```

---

## 🌟 Best Practices

- Keep `core/` decoupled: avoid any direct module/service usage here.
- Only use services needed for infrastructure logic.
- Replace magic strings/numbers with named constants.

---

```

---