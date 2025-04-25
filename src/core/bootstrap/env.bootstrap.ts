import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

export function loadEnvironment(): void {
  const nodeEnv = process.env.NODE_ENV || 'development';

  const envFilePath = path.resolve(process.cwd(), `.env.${nodeEnv}`);

  if (fs.existsSync(envFilePath)) {
    const env = dotenv.config({ path: envFilePath });
    dotenvExpand.expand(env);
    console.log(`✅ Loaded environment variables from ${envFilePath}`);
  } else {
    console.warn(`⚠️ .env.${nodeEnv} file not found, loading default .env`);
    dotenv.config(); // fallback
  }
}



/*

### 🧪 **Why `dotenv-expand`?**

`dotenv-expand` is a **companion to `dotenv`** that allows you to **use environment variable expansion**, i.e., reference one env variable from another **within your `.env` files**.

---

### 🧠 **What problem does it solve?**

The standard `dotenv` package does **not** support variable referencing like this:

```env
APP_NAME=MyApp
LOG_FILE_NAME=${APP_NAME}_log.txt
```

With only `dotenv`, `LOG_FILE_NAME` would be interpreted **literally** as `${APP_NAME}_log.txt`.

But with `dotenv-expand`, it becomes:
```env
LOG_FILE_NAME=MyApp_log.txt
```

---

### ✅ **When is it useful?**

In large-scale projects where:
- You have **many environment variables**
- Some values **depend on others** (e.g., filenames, base paths, or endpoints)
- You want to **avoid repetition**

---

### 💡 Example use case in your project:

```env
APP_ENV=dev
APP_NAME=EnterpriseApp
LOG_DIR=./logs
LOG_FILE=${LOG_DIR}/${APP_NAME}_${APP_ENV}.log
```

Without `dotenv-expand`, `LOG_FILE` would stay as `${LOG_DIR}/${APP_NAME}_${APP_ENV}.log`.  
With it, you'd get: `./logs/EnterpriseApp_dev.log`.

---

### 🚀 Summary

| Feature                | `dotenv` | `dotenv-expand` |
|------------------------|----------|------------------|
| Loads `.env` file      | ✅        | ✅                |
| Allows variable expansion | ❌       | ✅                |
| Supports advanced nesting | ❌       | ✅                |

---

## ✅ **Step 1: Environment & Deployment Strategy Setup**

You already:
- Load `.env` files.
- Use the `config/` directory for modular configuration (`app.config.ts`, `database.config.ts`, etc.).

Now let’s **formalize your environment and deployment setup** to support DEV, UAT, STAGING, and PRODUCTION seamlessly.

---

### 🔧 Recommended Environment Structure

#### 📁 `.env` Files in Root:
```plaintext
.env                 -> Default (local development)
.env.dev             -> Development-specific values
.env.uat             -> UAT-specific values
.env.staging         -> Staging-specific values
.env.production      -> Production-specific values
```

These files should **never** be committed with secrets. Instead, only `.env.example` is committed with placeholders.

---

### ✅ NestJS Env Loading Strategy

We will enhance the bootstrapping phase to:
1. Detect the environment (e.g., from `process.env.NODE_ENV`)
2. Load the corresponding `.env.<env>` file using `dotenv-flow` or `@nestjs/config` with custom logic

---

### 🧠 Suggested Approach for Environment Loading

#### ✅ Install dependencies:
```bash
npm install dotenv dotenv-expand
```

---

#### 🗂️ File: `bootstrap/env.bootstrap.ts`
```ts
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

export function loadEnvironment(): void {
  const nodeEnv = process.env.NODE_ENV || 'development';

  const envFilePath = path.resolve(process.cwd(), `.env.${nodeEnv}`);

  if (fs.existsSync(envFilePath)) {
    const env = dotenv.config({ path: envFilePath });
    dotenvExpand.expand(env);
    console.log(`✅ Loaded environment variables from ${envFilePath}`);
  } else {Please continue. Note that, I have already completed-
step-1: .env Strategy 
step-2: NODE_ENV & Mode Detection Utility
step-3: config.module.ts – Central ConfigModule
step-4: .env File Template
    console.warn(`⚠️ .env.${nodeEnv} file not found, loading default .env`);
    dotenv.config(); // fallback
  }
}
```

---

#### ✅ In `main.ts`:
```ts
import { loadEnvironment } from './bootstrap/env.bootstrap';

loadEnvironment(); // Before any Nest application logic
```

---

### 📁 Example `.env.dev`

```env
NODE_ENV=dev
APP_PORT=3000
APP_NAME=NestJS Enterprise App

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=nestjs_enterprise_dev

REDIS_HOST=localhost
REDIS_PORT=6379

QUEUE_DRIVER=redis
CACHE_DRIVER=memory
STORAGE_DRIVER=local

NOTIFICATION_EMAIL_ENABLED=true
NOTIFICATION_SMS_ENABLED=true
NOTIFICATION_PUSH_ENABLED=false
```

This will be consumed by your modular `config/` files such as `database.config.ts`, `cache.config.ts`, `queue.config.ts`, etc.

---

### 🛡️ Deployment Best Practices

| Environment | Strategy |
|-------------|----------|
| **Development** | Use `.env.dev`, local database, console logger, in-memory cache |
| **UAT** | `.env.uat`, use mounted external drive for file/jobs, enable full logging |
| **Staging** | `.env.staging`, similar to prod with internal endpoint access |
| **Production** | `.env.production`, secrets via cloud vault, logger → Loki/Grafana, Redis, S3, full queue system |

For secure environments, consider using **CI/CD secrets** (like GitHub Actions or GitLab CI secrets) to populate `.env.production` at deploy time.

---

### 📘 Summary

- We load different `.env` files based on `NODE_ENV`
- All `config/` modules read from `process.env`
- Local `.env` files are organized and isolated
- Secure environment-specific values are now easy to manage

---

✅ **Environment & deployment strategies are now ready.**

---

*/