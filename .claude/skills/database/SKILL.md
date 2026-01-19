---
name: database
description: Use when configuring database connections for Bknd, setting up SQLite or PostgreSQL databases, using database adapters, or configuring database-related settings like connection pooling and custom dialects. Covers SQLite (file-based, in-memory), PostgreSQL (pg, postgresJs), and custom dialects for cloud providers (Neon, Xata, Supabase, Turso, Cloudflare D1).
---

## Database Configuration

Configure your database connection in `bknd.config.ts`. Bknd supports SQLite (default) and PostgreSQL with multiple adapters for different runtimes.

## Quick Setup

```typescript
// SQLite (default)
export default {
  app: (env) => ({
    connection: {
      url: env.DB_URL ?? "file:data.db",
    },
  }),
};
```

## SQLite

Default database for development and local deployments.

### File-Based SQLite

```typescript
connection: {
  url: "file:data.db",
}
```

**Environment Variables:**
- `DB_URL` - Database connection string (default: `"file:data.db"`)

### In-Memory SQLite

```typescript
connection: {
  url: ":memory:",
}
```

Use for testing or temporary data. Data is lost when process exits.

### SQLite Type Mapping

| Bknd Type | SQLite Type |
|-----------|-------------|
| `boolean` | `INTEGER` (1/0) |
| `json` | `TEXT` |
| `integer` with primary key | `INTEGER` with `AUTOINCREMENT` |

## PostgreSQL

Production-ready database with `pg` or `postgresJs` adapters.

### pg Adapter (node-postgres)

Best for traditional Node.js applications with connection pooling:

```typescript
import { pg } from "bknd";
import { Pool } from "pg";

connection: {
  url: pg({
    pool: new Pool({
      connectionString: env.POSTGRES_URL,
    }),
  }),
}
```

**Environment Variables:**
- `POSTGRES_URL` - PostgreSQL connection string

### postgresJs Adapter (postgres-js)

Best for edge runtimes:

```typescript
import { postgresJs } from "bknd";
import postgres from "postgres";

connection: {
  url: postgresJs({
    postgres: postgres(env.POSTGRES_URL),
  }),
}
```

### PostgreSQL Type Mapping

| Bknd Type | PostgreSQL Type |
|-----------|-----------------|
| `blob` | `BYTEA` |
| `boolean` | `BOOLEAN` |
| `json` | `JSONB` |

## Custom PostgreSQL Dialects

Support for Neon, Xata, and other PostgreSQL-compatible services.

### Neon

```typescript
import { createCustomPostgresConnection } from "bknd";
import { NeonDialect } from "kysely-neon";

const neon = createCustomPostgresConnection("neon", NeonDialect);

connection: {
  url: neon({
    connectionString: process.env.NEON,
  }),
}
```

**Environment Variables:**
- `NEON` - Neon connection string

### Xata

```typescript
import { createCustomPostgresConnection } from "bknd";
import { XataDialect } from "@xata.io/kysely";
import { buildClient } from "@xata.io/client";

const client = buildClient();
const xata = new client({
  databaseURL: process.env.XATA_URL,
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH ?? "main",
});

const xataConnection = createCustomPostgresConnection("xata", XataDialect, {
  supports: {
    batching: false,
  },
});

connection: {
  url: xataConnection({ xata }),
}
```

**Environment Variables:**
- `XATA_URL` - Xata database URL
- `XATA_API_KEY` - Xata API key
- `XATA_BRANCH` - Xata database branch (default: `"main"`)

### Cloudflare D1

Cloudflare D1 is a SQLite-based edge database that works with the Cloudflare Workers adapter. Configure D1 bindings in `wrangler.json` and use the `d1()` function from the Cloudflare adapter:

```typescript
import { d1 } from "bknd/adapter/cloudflare";

export default {
  app: (env) => d1({ binding: env.D1_BINDING }),
};
```

The `d1()` function automatically detects the first available D1 binding. To specify a binding explicitly, pass it via the `binding` option:

**wrangler.json:**
```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-database",
      "database_id": "your-database-id"
    }
  ]
}
```

**Environment Variables:**
- `D1_BINDING` - Cloudflare D1 binding name (optional if using first available binding)

## Type Registration

Register your schema types for full type safety:

```typescript
import { em, entity, text, boolean } from "bknd";

const schema = em({
  todos: entity("todos", {
    title: text().required(),
    done: boolean(),
  }),
});

type Database = (typeof schema)["DB"];
declare module "bknd" {
  interface DB extends Database {}
}
```

## Seed Function

Populate your database with initial data (runs only if database is empty):

```typescript
options: {
  seed: async (ctx) => {
    await ctx.em.mutator("todos").insertMany([
      { title: "Learn bknd", done: true },
      { title: "Build something cool", done: false },
    ]);

    // Create admin user if auth enabled
    await ctx.app.module.auth.createUser({
      email: "admin@example.com",
      password: "secure-password-123",
    });
  },
}
```

**Seed Parameters:**
- `ctx.em` - EntityManager for database operations
- `ctx.app.module.auth` - Auth module for creating users

## Database Migration

As of v0.20.0, PostgreSQL adapters (`pg`, `postgresJs`) are available directly from `bknd` package.

**Before (v0.19.x):**
```typescript
import { pgPostgres } from "@bknd/postgres";
connection: {
  url: pgPostgres({
    connectionString: env.POSTGRES_URL,
  }),
}
```

**After (v0.20.0):**
```typescript
import { pg } from "bknd";
connection: {
  url: pg({
    pool: new Pool({
      connectionString: env.POSTGRES_URL,
    }),
  }),
}
```

## DOs and DON'Ts

**DO:**
- Use SQLite for development and testing
- Use PostgreSQL for production with `pg` adapter for Node.js
- Use `postgresJs` adapter for edge runtimes (Cloudflare Workers, Deno)
- Set `DB_URL` or `POSTGRES_URL` via environment variables
- Register types for full autocomplete support

**DON'T:**
- Use `:memory:` database for production (data is lost on restart)
- Mix database adapters in the same project
- Forget to update imports when upgrading from v0.19.x to v0.20.0
- Hardcode connection strings in config files (use environment variables)

## Complete Example

```typescript
import type { BkndConfig } from "bknd";
import { em, entity, text, boolean } from "bknd";
import { pg } from "bknd";
import { Pool } from "pg";

const schema = em({
  todos: entity("todos", {
    title: text().required(),
    done: boolean(),
  }),
});

type Database = (typeof schema)["DB"];
declare module "bknd" {
  interface DB extends Database {}
}

export default {
  app: (env) => ({
    connection: {
      url: env.POSTGRES_URL ? pg({
        pool: new Pool({
          connectionString: env.POSTGRES_URL,
        }),
      }) : "file:data.db",
    },
  }),
  config: {
    data: schema.toJSON(),
  },
  options: {
    seed: async (ctx) => {
      await ctx.em.mutator("todos").insertMany([
        { title: "Welcome to bknd", done: false },
      ]);
    },
  },
} as const satisfies BkndConfig<{
  POSTGRES_URL?: string;
}>;
```

## Next Steps

- Define your data schema with entities and fields (data-schema skill)
- Learn query syntax and filtering (query skill)
- Set up authentication and user management (auth skill)
