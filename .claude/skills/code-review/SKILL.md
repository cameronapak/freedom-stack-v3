---
name: code-review
description: Use when reviewing Bknd code, debugging issues, or checking for common mistakes. Covers anti-patterns, gotchas, known bugs, and troubleshooting strategies for Bknd v0.20.x applications. Use this skill to identify problems in existing code or prevent issues when writing new code.
---

# Code Review: Common Mistakes & Anti-Patterns

This skill helps you identify and fix common mistakes when working with Bknd. Review this checklist when auditing code or before merging changes.

## Critical Issues

### 1. Indexing Timestamp Fields

**Problem:** Attempting to index `created_at` or `updated_at` fields added by the `timestamps()` plugin causes "Field not found" errors and server crashes.

**Wrong:**
```typescript
const schema = em(
  {
    posts: entity("posts", {
      title: text().required(),
    }, {
      plugins: [timestamps()], // Adds created_at, updated_at
    }),
  },
  ({ index }, { posts }) => {
    // ❌ This crashes: "Field not found: created_at"
    index(posts).on(["created_at"]);
  },
);
```

**Correct:**
```typescript
// Option 1: Don't index timestamp fields (query without index)
const posts = await api.data.readMany("posts", {
  sort: { by: "created_at", dir: "desc" }
});

// Option 2: Define timestamp fields manually
const schema = em(
  {
    posts: entity("posts", {
      title: text().required(),
      createdAt: timestamp(),
      updatedAt: timestamp(),
    }),
  },
  ({ index }, { posts }) => {
    // ✅ This works
    index(posts).on(["createdAt"]);
  },
);

// Option 3: Create index at database level
// CREATE INDEX idx_posts_created_at ON posts(created_at);
```

**Reference:** GitHub Issue #325 (December 2025)

---

### 2. Password Validation Inconsistency

**Problem:** Users can sign up with passwords shorter than 8 characters, but login fails with the same password. The signup and login endpoints have inconsistent validation.

**Wrong:**
```typescript
// ❌ Relying solely on backend validation
await api.auth.signup({ email, password }); // Accepts 3-char passwords
await api.auth.login({ email, password });  // Fails if password < 8 chars
```

**Correct:**
```typescript
// ✅ Validate passwords on the client side
function validatePassword(password: string) {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must contain an uppercase letter");
  }
  if (!/[0-9]/.test(password)) {
    throw new Error("Password must contain a number");
  }
}

// Before calling the API
validatePassword(password);
await api.auth.signup({ email, password });
```

**Reference:** GitHub Issue #318 (December 2025)

---

### 3. Missing `await app.build()`

**Problem:** Calling `app.server.fetch()` without building the app causes runtime errors. The app must be built before processing requests.

**Wrong:**
```typescript
const app = createApp({ config });
// ❌ Missing await app.build()
return app.server.fetch(request);
```

**Correct:**
```typescript
const app = createApp({ config });
await app.build(); // ✅ Required!
return app.server.fetch(request);
```

---

## Configuration Mistakes

### 4. Incorrect Database Paths

**Problem:** Using relative paths that fail in production or missing the filename from the connection string.

**Wrong:**
```typescript
// ❌ Missing database filename
connection: { url: "file:" }

// ❌ Relative path may fail in production
connection: { url: "file:./bknd.db" }
```

**Correct:**
```typescript
// ✅ Include filename
connection: { url: "file:data.db" }

// ✅ Use environment variable for production
connection: {
  url: `file:${process.env.DATABASE_PATH || "./data/bknd.db"}`
}

// ✅ PostgreSQL
connection: {
  url: "postgresql://user:pass@localhost:5432/bknd"
}
```

---

### 5. Wrong Mode Sync Behavior

**Problem:** Trying to sync schema in Code Mode without the `--force` flag results in no database changes.

**Wrong:**
```bash
# ❌ This won't update the database in Code Mode
npx bknd sync
```

**Correct:**
```bash
# ✅ Required for Code Mode schema mutations
npx bknd sync --force

# Then regenerate types
npx bknd types --out bknd-types.d.ts
```

**Mode Behavior:**

| Mode | Config Source | Sync Command | When Changes Apply |
|------|---------------|--------------|-------------------|
| UI Mode | Database | N/A | Immediately (saved to DB) |
| Hybrid Mode | Code + DB | `npx bknd sync` | Dev: Immediately, Prod: On restart |
| Code Mode | Code only | `npx bknd sync --force` | On app restart |

---

### 6. Missing Type Generation

**Problem:** Skipping type generation or not including generated types in `tsconfig.json` causes TypeScript errors.

**Wrong:**
```typescript
// ❌ Using entities without type generation
const post = await em.repo("posts").find(id);
// TypeScript doesn't know post.title exists
```

**Correct:**
```bash
# Generate types
npx bknd types --out bknd-types.d.ts
```

```json
// tsconfig.json
{
  "include": [
    "bknd-types.d.ts",  // ✅ Include generated types
    "src/**/*"
  ]
}
```

```typescript
// Now TypeScript knows the schema
const post = await em.repo("posts").find(id);
// ✅ post.title is typed
```

---

## Anti-Patterns

### 7. Hardcoding Secrets in Config

**Wrong:**
```typescript
export default {
  config: {
    auth: {
      jwt: {
        secret: "super-secret-key-12345", // ❌ Committed to git
      },
    },
  },
};
```

**Correct:**
```typescript
export default {
  config: {
    auth: {
      jwt: {
        secret: process.env.JWT_SECRET, // ✅ From environment
      },
    },
  },
};
```

```bash
# .env (not committed)
JWT_SECRET=your-random-secret-here
```

---

### 8. Missing CORS Configuration

**Wrong:**
```typescript
// ❌ Custom server without CORS middleware
const app = serve(config);
// Browser blocks cross-origin requests
```

**Correct:**
```typescript
// ✅ Bknd adapters handle CORS automatically
const app = serve(config, { cors: true }); // Default enabled

// For custom Hono apps:
import { cors } from 'hono/cors';

app.use('*', cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true,
}));
```

---

### 9. Inconsistent Naming Convention

**Wrong:**
```typescript
// ❌ Mixed snake_case and camelCase
const schema = em({
  posts: entity("posts", {
    title: text(),
    created_at: timestamp(),  // snake_case
  }),
});
```

**Correct:**
```typescript
// ✅ Use camelCase consistently
const schema = em({
  posts: entity("posts", {
    title: text(),
    createdAt: timestamp(),
  }),
});
```

**Convention:** Use **camelCase** for entity and field names in your schema. This matches TypeScript/JavaScript conventions and Bknd's internal implementation.

---

## Performance Issues

### 10. Using UI Mode in Production

**Wrong:**
```typescript
// ❌ UI Mode reads schema from database on every request
export default {
  connection: { url: "file:data.db" },
  // No config.data = UI Mode
};
```

**Correct:**
```typescript
// ✅ Code Mode is 10x faster in production
const schema = em({
  todos: entity("todos", {
    title: text().required(),
    done: boolean(),
  }),
});

export default {
  config: {
    data: schema.toJSON(),
  },
};
```

**Why:** UI Mode adds a database query per request to fetch the schema. Code Mode reads from memory and is ideal for production.

---

### 11. Not Using WAL Mode for SQLite

**Wrong:**
```typescript
// ❌ Default SQLite has poor concurrency
connection: {
  url: "file:data.db",
}
```

**Correct:**
```typescript
import { nodeSqlite } from "bknd/adapter/node";

connection: nodeSqlite({
  url: "file:data.db",
  onCreateConnection: (db) => {
    // ✅ Enable Write-Ahead Logging for better concurrency
    db.exec("PRAGMA journal_mode = WAL;");
  },
});
```

---

## Deployment Issues

### 12. File-Based SQLite in Serverless Environments

**Wrong:**
```typescript
// ❌ File-based SQLite doesn't work in Cloudflare Workers / Lambda
connection: { url: "file:data.db" }
```

**Correct:**

**Cloudflare Workers (D1):**
```typescript
import { d1 } from "bknd/adapter/cloudflare";

connection: d1({
  binding: "DB", // Configured in wrangler.toml
});
```

**AWS Lambda (Turso):**
```typescript
import { turso } from "bknd/adapter/turso";

connection: turso({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

---

### 13. Headless Browser Auto-Open

**Problem:** CLI commands crash in CI/CD or Docker containers when trying to open a browser.

**Wrong:**
```bash
# ❌ Crashes with xdg-open error in headless environments
npx bknd create my-app
```

**Correct:**
```bash
# ✅ Disable browser auto-opening
export BROWSER=none
npx bknd create my-app

# Or use non-interactive mode
npx bknd create my-app --yes --template bun
```

---

## Common Gotchas

### 14. Admin UI Route 404

**Problem:** Clicking sidebar links in Admin UI results in 404 errors, especially after page refresh.

**Workarounds:**

1. Access Admin UI at the root path (`/admin`) and navigate from there
2. Avoid bookmarking specific Admin UI URLs
3. Check your `basepath` configuration:
   ```typescript
   <Admin config={{ basepath: "/admin" }} />
   ```

**Reference:** GitHub Issue #216 (ongoing since July 2025)

---

### 15. Token Expiration Without Refresh

**Problem:** Users get logged out unexpectedly when JWT tokens expire (default: 24 hours).

**Wrong:**
```typescript
// ❌ Assuming tokens last forever
const token = await api.auth.login({ email, password });
localStorage.setItem('token', token);
```

**Correct:**

Increase token expiration:
```typescript
config: {
  auth: {
    jwt: {
      expires: "7d", // Increase from default 24h
      issuer: "your-app"
    }
  }
}
```

Monitor expiration:
```typescript
// Check token validity before making requests
const isValid = await api.auth.me();
if (!isValid) {
  // Re-authenticate
  await api.auth.login({ email, password });
}
```

**Note:** Token refresh workflow is not yet documented in Bknd.

---

## Debugging Checklist

When reviewing Bknd code, check for:

- [ ] `await app.build()` called before using the app
- [ ] Type generation included in `tsconfig.json`
- [ ] Database path uses absolute path or environment variable in production
- [ ] Correct mode sync command (`--force` for Code Mode)
- [ ] Secrets stored in environment variables, not hardcoded
- [ ] CORS configured for browser clients
- [ ] Consistent camelCase naming convention
- [ ] WAL mode enabled for SQLite
- [ ] No indexing of timestamp plugin fields (add manually if needed)
- [ ] Client-side password validation before API calls
- [ ] Correct database adapter for serverless environments
- [ ] JWT token expiration configured appropriately

---

## When to Use This Skill

Trigger this skill when:
- Reviewing a pull request that uses Bknd
- Debugging Bknd-related errors
- Writing Bknd code for the first time
- Migrating from another backend framework
- Setting up CI/CD for a Bknd project

---

## DOs and DON'Ts

**DO:**
- Call `await app.build()` before using the app
- Generate types after schema changes
- Use Code Mode for production
- Add manual timestamp fields if you need to index them
- Validate passwords on the client side
- Enable WAL mode for SQLite in development
- Use environment variables for secrets

**DON'T:**
- Index timestamp plugin fields directly (add manually)
- Skip type generation
- Use UI Mode in production (slow)
- Forget the `--force` flag for Code Mode sync
- Commit `.env` files or database files to git
- Use file-based SQLite in serverless environments
- Hardcode secrets in config files

---

## Common Error Messages

**"Field not found: created_at"**
- Cause: Indexing timestamp plugin fields
- Fix: Add timestamp fields manually or don't index them

**"Module not found: bknd-types.d.ts"**
- Cause: Types not generated or not included in tsconfig
- Fix: Run `npx bknd types` and update tsconfig.json

**"Database connection failed"**
- Cause: Invalid connection string or missing database file
- Fix: Verify connection string format and ensure directory exists

**"401 Unauthorized"**
- Cause: JWT token expired or invalid
- Fix: Re-authenticate or increase token expiration time

**"CORS policy error"**
- Cause: CORS not configured for browser client
- Fix: Enable CORS in adapter or add middleware

---

## Related Skills

- [Getting Started](getting-started) - Setup and configuration
- [Data Schema](data-schema) - Entity definition best practices
- [Config Modes](config-modes) - Understanding Code/Hybrid/UI modes
- [Deploy](deploy) - Production deployment patterns
