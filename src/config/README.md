Awesome! Let’s continue with the documentation for the next major folder:

---

## 📁 `src/config/` – Configuration Layer Documentation

```markdown
# ⚙️ config/

The `config/` folder centralizes all application configurations, abstracted per concern (auth, db, cache, etc.). Each config is loaded via `@nestjs/config` and can vary per environment using `.env` files.

The ConfigModule is made **global**, so all modules and services can access any config without re-importing.

---

## 📄 config.module.ts

The entry point for the config system.

### Responsibilities:
- Loads `.env` variables (using `dotenv`)
- Registers all config files
- Sets global scope for easy access
- Enables config schema validation if needed

```ts
ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig, dbConfig, cacheConfig, authConfig, ...],
});
```

---

## 🌐 Config Files

Each file inside `config/` represents a domain of concern and follows this convention:

### Template:
```ts
export default () => ({
  KEY: process.env.KEY || 'default',
  nested: {
    value: parseInt(process.env.NESTED_VAL || '0'),
  },
});
```

---

## 📂 Config Files List

| File | Purpose |
|------|---------|
| `app.config.ts` | Global app configs (name, port, env, URL) |
| `auth.config.ts` | JWT secrets, expiry, OAuth toggles |
| `cache.config.ts` | Cache driver selection (memory, Redis, Memcached) |
| `mail.config.ts` | SMTP configs, provider settings |
| `sms-gateway.config.ts` | API keys and endpoints for SMS |
| `notification.config.ts` | Enable/disable notification channels |
| `file.config.ts` | File upload mode (local/cloud), paths |
| `kafka.config.ts` | Kafka broker settings |
| `queue.config.ts` | Background job queue settings |
| `rate-limit.config.ts` | Global/user rate-limiting toggles |
| `websocket.config.ts` | WebSocket host, port, protocols |
| `event-stream.config.ts` | Kafka/NATS topic configurations |
| `external-api.config.ts` | Third-party integration URLs and tokens |
| `message-broaker.config.ts` | Common config for Kafka/NATS abstraction |
| `logger.config.ts` | Logging mode, level, file path, Loki setup |
| `swagger.config.ts` | Swagger enable/disable, docs route |
| `sse.config.ts` | SSE base config (retry, heartbeat, etc.) |

---

## 📦 Usage

Access config in services or modules via:

```ts
@Injectable()
export class SomeService {
  constructor(
    private readonly configService: ConfigService
  ) {}

  someLogic() {
    const redisUrl = this.configService.get('cache.redisUrl');
  }
}
```

Or with auto-typed configs:

```ts
const config = configuration();
const port = config.app.port;
```

---

## 🛠 Environment-Specific Overrides

Use `.env` files like:

- `.env.development`
- `.env.test`
- `.env.staging`
- `.env.production`

Use a wrapper like `env-cmd`, or set `NODE_ENV` and conditionally load these files in `main.ts` or `bootstrap/core/bootstrap.ts`.

---

## 🧪 Tips

- Centralize all `.env` key names here to avoid typos.
- Group configs for feature toggles in a dedicated file (e.g., `features.config.ts`).
- Add `.env.example` as a template.

---

## ✅ Example `.env` Block

```env
APP_NAME=AwesomeApp
APP_PORT=3000
APP_ENV=development
CACHE_DRIVER=redis
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=supersecret
JWT_EXPIRES_IN=3600s
```

---

```

---