# 🧰 common/

The `common/` directory contains reusable, shared logic that is **agnostic of domain logic**. These building blocks can be used across all modules for consistency and maintainability.

It follows **DRY (Don't Repeat Yourself)** and **Separation of Concerns (SoC)** principles.

This directory contains everything that is reused across modules: DTOs, interfaces, decorators, filters, guards, interceptors, utilities, helpers, constants, etc.

Anything generic, reusable, and non-module specific belongs here.

---

## 📂 Subfolders

```bash
src/common/
├── decorators/              # 🏷️ Custom method/property/class decorators
├── dto/                     # 📦 Shared DTOs and payload structures
├── enums/                   # 📘 Shared enums used across modules
├── exceptions/              # 🚫 Custom exception classes (extends HttpException)
├── guards/                  # 🛡️ Reusable global and module-level guards
├── interceptors/            # 🎯 Response interceptors, logging, timeout, etc.
├── interfaces/              # 🔗 Global TypeScript interfaces and shared types
├── middleware/              # 🧵 Middleware (e.g., trace, auth, tenant)
├── pipes/                   # 🧹 Global validation/transform pipes
├── transformers/            # 🔁 Output transformers for response shaping
├── utils/                   # 🛠️ Helper utility functions
├── validators/              # 📏 Custom validation decorators & class validators
├── file-manipulation/       # 🗃️ Sharp, ExcelJS, Microsoft Word(docxtemplater pizzip, html-docx-js), PDFKit wrappers
└── index.ts                 # 🎯 Export barrel for shared use

---

## 📁 decorators/

Custom NestJS decorators that wrap common behaviors, metadata, or context extraction.

```bash
src/common/decorators/
├── current-user.decorator.ts // Extracts user from request
├── public-route.decorator.ts // Marks route as publicly accessible
├── roles.decorator.ts        // Role-based authorization
├── permissions.decorator.ts  // Permissions-based access control
```

### Examples

- `@CurrentUser()` – Injects currently authenticated user from request.
- `@Roles()` – Define role-based access metadata.
- `@Trace()` – Attaches traceId to internal logs/methods.

> ✅ These improve **code readability**, **avoid boilerplate**, and **centralize logic**.

Custom NestJS or TypeScript decorators (e.g., @CurrentUser(), @TraceId()).

Example:

```ts
Copy
Edit
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

---

## 📁 dtos/

Globally shared DTOs (Data Transfer Objects). These include request validation shapes and utility data schemas used across modules.

```ts
src/common/dtos/
├── pagination.dto.ts        // Generic pagination DTO
├── response.dto.ts          // Standard API response format
├── base.dto.ts              // DTO with id, timestamps, etc.
### Examples

- `PaginateDto` – Shared for all paginated API endpoints.
- `DateRangeDto` – Reusable for filter-based modules.

> 📦 DTOs in this folder are imported in **many modules**. They should not include domain-specific logic.
Shared DTOs (Data Transfer Objects) like pagination, filters, or common payloads.

```ts
 class PaginationDto {
  @IsOptional() @IsInt() limit?: number;
  @IsOptional() @IsInt() page?: number;
}
```

---

## 📁 exceptions/

Custom exception classes and global filters that extend NestJS's HTTP Exception system.

### Includes

- `AppExceptionFilter` – Centralized error formatting and logging.
- `CustomHttpException` – Base class for all custom errors.
- `DatabaseException`, `ValidationException`, etc.

> 🚨 Improve error consistency, traceability, and developer experience.

Custom exceptions with useful metadata.
Example:

```ts
export class PermissionDeniedException extends HttpException {
  constructor(reason = 'Permission denied') {
    super(reason, HttpStatus.FORBIDDEN);
  }
}
```

---

## 📁 filters/

```bash
src/common/filters/
├── http-exception.filter.ts     // Global HTTP error handler
├── all-exceptions.filter.ts     // Fallback for uncaught exceptions
```

✅ Use Case: Standardized error format, logging, and integration with monitoring tools.

---

## 📁 guards/

Authentication/authorization guards to protect routes and services.

src/common/guards/
├── auth.guard.ts              // Validates access token
├── permissions.guard.ts       // Validates required permissions
├── roles.guard.ts             // Role-based guard
├── tenant.guard.ts            // Tenant context validation

### Examples

- `PermissionsGuard` – Uses `@Permissions()` decorator + RBAC metadata.
- `TenantGuard` – Validates current tenant scope.
- `RateLimitGuard` – Optional global/per-user rate-limiting.

Security and logic guards (e.g., PermissionsGuard, TenantGuard).

```ts
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return Boolean(request.tenant);
  }
}
```

> 🛡️ Always keep **lightweight logic** here and delegate checks to services if complex.

---

## 📁 interceptors/

Useful for modifying request/response cycles, performance monitoring, logging, etc.

src/common/interceptors/
├── response.interceptor.ts     // Wraps all responses into a consistent format
├── transform.interceptor.ts    // Applies transformations (e.g., rename fields)
├── timeout.interceptor.ts      // Applies timeout limit to request

Examples:

- `LoggingInterceptor` – Attaches logs to each request/response.
- `TimeoutInterceptor` – Sets global/external timeout on requests.
- `TransformInterceptor` – Formats all successful responses.

Used for:

- Logging
- Response transformation
- Timeout enforcement

```ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(tap(() => Logger.log(`After... ${Date.now() - now}ms`)));
  }
}
```

> 🔁 Interceptors are global middleware-style hooks. Reusable and powerful.

## ✅ Use Case: Clean controller logic, add reusable behavior for all or specific routes

---

## 📁 interfaces/

Custom types/interfaces used across modules and system layers.

src/common/interfaces/
├── user.interface.ts        // e.g., IUser for decorators/services
├── audit.interface.ts       // For audit logging service
├── notification.interface.ts// Shared contract for notification types

### Examples

- `Paginated<T>` – Response structure for paginated lists.
- `RequestContext` – Extended request with user, traceId, tenant, etc.

> 🧬 Centralized definitions make code safer and easier to refactor.
Shared global types/interfaces used across layers. Can include:

- Generic service contracts
- Authenticated request type
- User session model

---

📏 validators/
Reusable custom validation decorators.

```ts
@ValidatorConstraint({ async: true })
export class IsPhoneNumberUnique implements ValidatorConstraintInterface {
  validate(phone: string) {
    return !User.findOne({ phone });
  }
}
```

---

## 📁 middleware/

Custom NestJS middleware functions.

### Examples

- `trace.middleware.ts` – Generates and attaches `traceId`, `requestId`.
- `request-context.middleware.ts` – Injects context for all layers.

Reused NestJS middleware for:

- Trace ID propagation
- Request logging
- IP extraction

```ts
export function TraceMiddleware(req, res, next) {
  req.traceId = uuidv4();
  next();
}
```

> 🔀 Applied globally in `main.ts` or bootstrap logic for consistent behavior.

---

## 🔁 transformers/

Used to convert output DTOs or database entities to a final response format.
Example:

```ts
ts
export class UserTransformer {
  static toPublicProfile(user: UserEntity): PublicUserDto {
    return {
      id: user.id,
      name: user.name,
    };
  }
}

---

## 📁 pipes/

Validation and transformation pipes that plug into request pipelines.

```bash
src/common/pipes/
├── parse-objectid.pipe.ts       // Converts string to MongoDB ObjectId (if used)
├── trim.pipe.ts                 // Trims strings in DTOs
├── sanitize.pipe.ts             // Strips HTML/JS from inputs

```

### Examples

- `ParseObjectIdPipe`
- `TransformBooleanPipe`
- `ValidationPipe` (Customized version)

Custom pipes for parsing, validating, transforming.

```ts
@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: string): ObjectId {
    if (!ObjectId.isValid(value)) throw new BadRequestException('Invalid ID');
    return new ObjectId(value);
  }
}
```

> 🧹 Use to enforce strong data consistency before controller/service logic.
✅ Use Case: Input transformation before it reaches controllers.
---

## 📁 utils/

Helper functions, constants, converters that are pure, side-effect free, and highly reusable.

```bash
src/common/utils/
├── date.utils.ts                // Date formatting, parsing, etc.
├── string.utils.ts              // Slugify, camelCase, titleCase, etc.
├── url.utils.ts                 // URL formatting or parsing
├── validation.utils.ts          // Helper to validate input shape, format

```

### Examples

- `string.utils.ts` – slugify, capitalize, truncate
- `date.utils.ts` – parse, format, timezone-safe
- `file.utils.ts` – MIME detection, extension parsing

Utility functions like:

- getClientIp()
- generateSlug()
- chunkArray()
- maskEmail()

> 🛠 Use these across the entire codebase. No dependencies on NestJS or DB.
✅ Use Case: Pure functions reused in services and controllers, unit-test friendly.
---

## 📁 file-manipulation/

Specialized utilities for generating/manipulating files: PDFs, Excel, images, etc.

```bash
src/common/file-manipulation/
├── image.processor.ts           // Uses Sharp for resizing, thumbnails, etc.
├── excel.generator.ts           // ExcelJS-based exports
├── pdf.generator.ts             // PDFKit wrapper for generating reports
├── zip.utils.ts                 // Archiving/unzipping tools

```

### Includes

- `pdf.service.ts` – PDFKit based document generation
- `excel.util.ts` – ExcelJS worksheet handling
- `image.util.ts` – Image resize, crop (via Sharp)
Wrappers around file tools like:

> 🔍 sharp for image processing
- 📊 ExcelJS for spreadsheet generation
- 📄 PDFKit for PDFs

Includes utility classes and service-based abstractions.

> 🖨️ These are used by job processors, reporting modules, and admin panels.

---

## ✅ Best Practices

- 🔄 All helpers should be **pure** unless explicitly stateful.
- 🌐 Avoid importing `@nestjs/*` inside utils – keep decoupled.
- 🧪 Write tests for custom pipes, exceptions, and decorators.
- 📦 Never couple `common/` with specific business logic (`users/`, `roles/`, etc.)
- Avoid business logic here — this folder is purely for reusable, infrastructure-level components.
- All contents should be framework-agnostic (where possible) and pure functions or lightweight services.
- Use centralized decorators and DTOs to reduce duplication across modules.

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
