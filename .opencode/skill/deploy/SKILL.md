---
name: deploy
description: Use when deploying a Bknd application to production platforms like Vercel, AWS Lambda, Cloudflare Workers, or Docker. Covers environment configuration, database setup, production optimizations, and platform-specific considerations.
---

# Deploying Bknd to Production

Deploy Bknd applications to your preferred platform. Bknd supports serverless platforms (Vercel, AWS Lambda, Cloudflare Workers), containerized deployments (Docker), and traditional Node.js servers.

## What You'll Learn

- Configure production databases (PostgreSQL, Turso)
- Set up environment variables
- Deploy to Vercel, AWS Lambda, Cloudflare Workers, or Docker
- Handle authentication and media storage in production
- Optimize for edge deployments

## Production Database Setup

Choose a cloud database for production. File-based SQLite doesn't work reliably in serverless environments.

### PostgreSQL (Recommended)

Use `pg` adapter for connection pooling or `postgresJs` for edge runtimes.

**With pg (node-postgres):**
```typescript
import { pg } from "bknd";
import { Pool } from "pg";

export default {
  connection: pg({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
} satisfies BkndConfig;
```

**With postgresJs (edge-compatible):**
```typescript
import { postgresJs } from "bknd";
import postgres from "postgres";

export default {
  connection: postgresJs({
    postgres: postgres(process.env.DATABASE_URL),
  }),
} satisfies BkndConfig;
```

**Providers:** Neon, Supabase, Railway, AWS RDS.

**Note:** As of v0.20.0, PostgreSQL adapters (`pg`, `postgresJs`) are available directly from the `bknd` package. Previously they were in a separate `@bknd/postgres` package.

### Turso (Edge SQLite)

Turso provides hosted SQLite with edge replication. Best for Vercel Edge Functions and Cloudflare Workers.

```typescript
export default {
  connection: {
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies BkndConfig;
```

Set environment variables:
```env
TURSO_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"
```

## Deployment Platforms

### Vercel

#### Step 1: Configure for Production

Update your `bknd.config.ts` to use environment variables:

```typescript
import type { NextjsBkndConfig } from "bknd/adapter/nextjs";

export default {
  connection: {
    url: process.env.DATABASE_URL || "file:data.db",
  },
} satisfies NextjsBkndConfig;
```

#### Step 2: Edge Runtime (Optional)

For edge deployments with Turso or PostgreSQL:

```typescript
// src/app/api/[[...bknd]]/route.ts
import { config } from "@/bknd";
import { serve } from "bknd/adapter/nextjs";

export const runtime = "edge";

const handler = serve({ ...config });

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
```

#### Step 3: Deploy

1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables:
   - `DATABASE_URL` (PostgreSQL or Turso)
   - `TURSO_AUTH_TOKEN` (if using Turso)
4. Deploy

**Production Checklist:**
- [ ] Database connection string configured
- [ ] Admin UI protected with authentication
- [ ] Media storage uses cloud provider (S3, R2)
- [ ] Environment variables set
- [ ] Edge runtime enabled if using Turso

### AWS Lambda

#### Step 1: Create Entry Point

Create `index.mjs`:

```javascript
import { serve } from "bknd/adapter/aws";

export const handler = serve({
  assets: {
    mode: "local",
    root: "./static",
  },
  connection: {
    url: process.env.DB_URL,
    authToken: process.env.DB_TOKEN,
  },
});
```

#### Step 2: Build and Deploy

```bash
# Copy Admin UI assets
npx bknd copy-assets --out=static

# Bundle with esbuild
npx esbuild index.mjs \
  --bundle \
  --format=cjs \
  --platform=browser \
  --external:fs \
  --minify \
  --outfile=dist/index.js

# Package
(cd dist && zip -r lambda.zip .)

# Deploy to Lambda
aws lambda update-function-code \
  --function-name bknd-lambda \
  --zip-file fileb://dist/lambda.zip
```

#### Step 3: Configure Lambda

**Settings:**
- Runtime: `nodejs22.x`
- Architecture: `arm64`
- Memory: `1024` MB (adjust based on workload)
- Timeout: `30` seconds (increase if needed)

**Environment Variables:**
```env
DB_URL="postgresql://user:password@host:5432/dbname"
DB_TOKEN="" # Optional, for Turso
```

**Production Considerations:**
- Use RDS Proxy for connection pooling with PostgreSQL
- Enable provisioned concurrency to reduce cold starts
- Store secrets in AWS Secrets Manager
- Use VPC for private database access

### Cloudflare Workers

#### Step 1: Configure Wrangler

Create `wrangler.json`:

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "bknd-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-08-03",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./node_modules/bknd/dist/static"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "bknd-prod",
      "database_id": "your-database-id"
    }
  ],
  "r2_buckets": [
    {
      "binding": "BUCKET",
      "bucket_name": "bknd-media"
    }
  ]
}
```

#### Step 2: Create Worker Entry Point

Create `src/index.ts`:

```typescript
import { serve } from "bknd/adapter/cloudflare";
import config from "../config";

export default serve(config);
```

Create `config.ts`:

```typescript
import type { CloudflareBkndConfig } from "bknd/adapter/cloudflare";

export default {
  d1: {
    session: true,
  },
} satisfies CloudflareBkndConfig;
```

#### Step 3: Deploy

```bash
# Create D1 database (if needed)
npx wrangler d1 create bknd-prod

# Deploy
npx wrangler deploy
```

**Production Checklist:**
- [ ] D1 database_id configured
- [ ] R2 bucket configured for media storage
- [ ] `workers_dev: false` for production
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled

### Docker

#### Step 1: Create Dockerfile

```dockerfile
# Build stage
FROM node:24 as builder
WORKDIR /app
RUN npm install --omit=dev bknd@latest

# Runtime stage
FROM node:24-alpine
WORKDIR /app
RUN npm install -g pm2
RUN echo '{"type":"module"}' > package.json

COPY --from=builder /app/node_modules/bknd/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

VOLUME /data
ENV DEFAULT_ARGS="--db-url file:/data/data.db"

EXPOSE 1337
CMD ["pm2-runtime", "dist/cli/index.js run ${ARGS:-${DEFAULT_ARGS}} --no-open"]
```

#### Step 2: Build and Run

```bash
# Build image
docker build -t bknd .

# Run with default SQLite
docker run -p 1337:1337 bknd

# Run with PostgreSQL
docker run -p 1337:1337 \
  -e ARGS="--db-url postgres://user:password@host:5432/dbname" \
  bknd

# Run with volume persistence
docker run -p 1337:1337 \
  -v /path/to/data:/data \
  bknd
```

#### Step 3: Docker Compose

Create `compose.yml`:

```yaml
services:
  bknd:
    pull_policy: build
    build: .
    ports:
      - "1337:1337"
    environment:
      ARGS: "--db-url postgres://bknd:password@postgres:5432/bknd"
    depends_on:
      - postgres
    volumes:
      - ./data:/data

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: bknd
      POSTGRES_PASSWORD: password
      POSTGRES_DB: bknd
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

Run with:
```bash
docker compose up -d
```

## Production Configuration

### Media Storage

Configure cloud storage for production. Local filesystem doesn't work in serverless environments.

**AWS S3:**
```typescript
import { S3Adapter } from "bknd";

export default {
  media: {
    adapter: new S3Adapter({
      region: process.env.AWS_REGION,
      bucket: process.env.S3_BUCKET,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }),
  },
} satisfies BkndConfig;
```

**Cloudflare R2:**
```typescript
import { S3Adapter } from "bknd"; // R2 is S3-compatible

export default {
  media: {
    adapter: new S3Adapter({
      region: "auto",
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      bucket: process.env.R2_BUCKET,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    }),
  },
} satisfies BkndConfig;
```

### Configuration Mode

Use **Code Mode** for production to ensure schema is versioned in code:

```typescript
import schema from "./bknd.schema";

export default {
  connection: {
    url: process.env.DATABASE_URL!,
  },
  data: {
    mode: "code",
    schema,
  },
} satisfies BkndConfig;
```

For development, use Database Mode for quick iteration. For production, Code Mode or Hybrid Mode (Database in dev, Code in prod) is recommended.

### Environment Variables

**Required:**
```env
DATABASE_URL=""          # PostgreSQL or Turso URL
TURSO_AUTH_TOKEN=""      # If using Turso
```

**Media Storage:**
```env
AWS_REGION=""            # If using S3
S3_BUCKET=""             # If using S3
AWS_ACCESS_KEY_ID=""     # If using S3
AWS_SECRET_ACCESS_KEY="" # If using S3
```

**Auth:**
```env
JWT_SECRET=""            # Auto-generated if not set
```

## Common Production Issues

### Database Connection Failed

**Problem:** Cannot connect to database after deployment

**Solutions:**
- Verify `DATABASE_URL` is set in platform environment variables
- Check database firewall allows connections from deployment platform
- For RDS, ensure VPC and security groups are configured
- For Turso, verify auth token is correct

### Auth Not Working

**Problem:** Authentication fails after deployment

**Solutions:**
- Ensure cookies use `secure: true` in production
- Verify `NEXT_PUBLIC_API_URL` or equivalent is set correctly
- Check CORS configuration if using separate domains
- Ensure auth module is enabled in config

### Media Uploads Failing

**Problem:** File uploads fail in production

**Solutions:**
- Switch from local storage to S3/R2 storage
- Verify storage credentials are configured
- Check bucket permissions allow write access
- Ensure storage bucket exists in correct region

### Cold Starts (Serverless)

**Problem:** First requests are slow

**Solutions:**
- Enable provisioned concurrency (AWS Lambda)
- Optimize bundle size (tree-shake unused dependencies)
- Use edge runtime (Vercel, Cloudflare Workers) for faster startup
- Keep database connections warm with connection pooling

## DOs and DON'Ts

### DO
- Use cloud databases (PostgreSQL, Turso) for production
- Configure media storage to use S3, R2, or cloud provider
- Use Code Mode or Hybrid Mode for production
- Set environment variables via platform configuration, not code
- Protect Admin UI with authentication
- Test deployment in staging before production
- Enable monitoring and logging (CloudWatch, Vercel Analytics)

### DON'T
- Use file-based SQLite in serverless deployments
- Store secrets in code or git
- Use local filesystem for media storage in serverless
- Deploy Database Mode to production without testing
- Expose Admin UI without authentication
- Skip edge runtime when using Turso
- Ignore cold start optimization for high-traffic apps

## Troubleshooting by Platform

### Vercel
- Build errors: Check `vercel.json` or `next.config.js` configuration
- Edge runtime errors: Remove incompatible dependencies or switch to Node runtime
- Environment variables not loading: Verify variable names match exactly (case-sensitive)

### AWS Lambda
- "Cannot find module": Ensure esbuild bundles all dependencies
- Database timeouts: Increase timeout, check VPC/security group configuration
- Cold starts: Enable provisioned concurrency, optimize bundle

### Cloudflare Workers
- D1 errors: Verify `database_id` in `wrangler.json` matches actual database
- Assets not loading: Ensure `assets.directory` points to correct path
- Type errors: Run `npx wrangler types` to regenerate types

### Docker
- Permission errors: Fix volume ownership with `chown` in container
- Port conflicts: Change exposed port with `-p 3000:1337`
- Data not persisting: Ensure volumes are mounted correctly

## Platform Comparison

| Platform | Best For | Database | Media Storage | Cold Starts |
|----------|----------|----------|---------------|-------------|
| **Vercel** | Next.js apps | PostgreSQL, Turso | S3, R2 | Medium (edge: low) |
| **AWS Lambda** | Serverless APIs | PostgreSQL, RDS | S3 | High (with optimization) |
| **Cloudflare Workers** | Global edge apps | D1 (Turso) | R2 | Very Low |
| **Docker** | Self-hosted, on-prem | PostgreSQL, SQLite | S3, local | Low |

## Next Steps

- [Database Configuration](/database) - Learn more about database options
- [Config Modes](/config-modes) - Choose between database, code, and hybrid modes
- [Media](/media) - Configure media storage adapters
- [Authentication](/auth) - Set up secure authentication for production
