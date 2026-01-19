---
name: auth
description: Use when implementing authentication in Bknd, configuring auth strategies (password, OAuth, email OTP), managing sessions with JWT/cookies, creating users, and protecting endpoints. Covers auth module configuration, user management, and security best practices.
---

# Authentication Module

Bknd provides comprehensive authentication with multiple strategies, JWT token management, secure cookies, and role-based authorization.

## What You'll Learn

- Enable and configure the auth module
- Set up password, OAuth, and email OTP strategies
- Configure JWT tokens and secure cookies
- Create users via CLI, programmatic API, or OAuth
- Use authentication endpoints
- Follow security best practices

## Enable Auth

Add auth configuration to your `bknd.config.ts`:

```typescript
export default {
  config: {
    auth: {
      enabled: true,
      jwt: {
        issuer: 'your-app-name',
      },
    },
  },
};
```

Bknd auto-generates a secure JWT secret if you don't provide one. In production, set a secret via environment variable.

## Password Strategy

Email/password authentication with automatic hashing.

### Configuration

```typescript
export default {
  config: {
    auth: {
      enabled: true,
      allow_register: true, // Allow public registration
      strategies: {
        password: {
          type: 'password',
          enabled: true,
          config: {
            hashing: 'sha256', // 'plain' | 'sha256' | 'bcrypt'
            rounds: 4, // For bcrypt only (1-10)
            minLength: 8,
          },
        },
      },
    },
  },
};
```

### API Endpoints

**Register new user:**
```bash
POST /api/auth/password/register
Content-Type: application/json

{ "email": "user@example.com", "password": "securepass123" }
```

Response:
```json
{ "user": { "id": 1, "email": "...", "role": "user" }, "token": "jwt..." }
```

**Login:**
```bash
POST /api/auth/password/login
Content-Type: application/json

{ "email": "user@example.com", "password": "securepass123" }
```

Response:
```json
{ "user": { "id": 1, "email": "...", "role": "user" }, "token": "jwt..." }
```

**Logout:**
```bash
GET /api/auth/logout
```

Clears auth cookie and redirects to configured `pathLoggedOut`.

## OAuth Strategy

Built-in support for Google, GitHub, Discord, Facebook.

### Built-in Providers

```typescript
export default {
  config: {
    auth: {
      enabled: true,
      strategies: {
        google: {
          type: 'oauth',
          enabled: true,
          config: {
            name: 'google',
            type: 'oidc',
            client: {
              client_id: process.env.GOOGLE_CLIENT_ID,
              client_secret: process.env.GOOGLE_CLIENT_SECRET,
            },
          },
        },
        github: {
          type: 'oauth',
          enabled: true,
          config: {
            name: 'github',
            type: 'oauth2',
            client: {
              client_id: process.env.GITHUB_CLIENT_ID,
              client_secret: process.env.GITHUB_CLIENT_SECRET,
            },
          },
        },
      },
    },
  },
};
```

### OAuth Flow

**Initiate login:**
```bash
GET /api/auth/google/login
```

Redirects to Google authorization page.

**Callback:**
```bash
GET /api/auth/google/callback?code=...&state=...
```

Handles OAuth callback, creates/updates user, sets auth cookie, redirects to configured `pathSuccess`.

### Custom OAuth

Define custom OAuth 2.0 providers:

```typescript
export default {
  config: {
    auth: {
      enabled: true,
      strategies: {
        my_provider: {
          type: 'custom_oauth',
          enabled: true,
          config: {
            name: 'my_provider',
            type: 'oauth2',
            as: {
              issuer: 'https://auth.example.com',
              authorization_endpoint: 'https://auth.example.com/authorize',
              token_endpoint: 'https://auth.example.com/token',
              userinfo_endpoint: 'https://auth.example.com/userinfo',
              scopes_supported: ['openid', 'email', 'profile'],
            },
            client: {
              client_id: process.env.PROVIDER_CLIENT_ID,
              client_secret: process.env.PROVIDER_CLIENT_SECRET,
              token_endpoint_auth_method: 'client_secret_post',
            },
            profile: (userInfo, config, tokenResponse) => ({
              sub: userInfo.id,
              email: userInfo.email,
              name: userInfo.name,
            }),
          },
        },
      },
    },
  },
};
```

## Email OTP (Passwordless)

Time-based one-time passwords sent via email. Requires the email OTP plugin.

### Configuration

```typescript
import { emailOTP } from 'bknd/plugins';
import { resendEmail } from 'bknd';

export default {
  config: {
    auth: {
      enabled: true,
    },
  },
  options: {
    drivers: {
      email: resendEmail({
        apiKey: process.env.RESEND_API_KEY,
        from: 'noreply@example.com',
      }),
    },
    plugins: [
      emailOTP({
        ttl: 600, // Code expires in 10 minutes
        generateEmail: (otp) => ({
          subject: 'Your Login Code',
          body: `Your code is: ${otp.code}`,
        }),
      }),
    ],
  },
};
```

### OTP Flow

**Request code:**
```bash
POST /api/auth/otp/login
Content-Type: application/json

{ "email": "user@example.com" }
```

Response:
```json
{ "sent": true, "data": { "email": "...", "expires_at": "..." } }
```

**Verify and login:**
```bash
POST /api/auth/otp/login
Content-Type: application/json

{ "email": "user@example.com", "code": "123456" }
```

Response:
```json
{ "user": { "id": "...", "email": "...", "role": "user" }, "token": "jwt..." }
```

## JWT Configuration

Configure token signing and expiration:

```typescript
export default {
  config: {
    auth: {
      jwt: {
        secret: process.env.JWT_SECRET, // Auto-generated if empty
        alg: 'HS256', // HS256 | HS384 | HS512
        expires: 3600, // Token expires in 1 hour
        issuer: 'your-app-name',
        fields: ['id', 'email', 'role'], // Fields in JWT payload
      },
    },
  },
};
```

## Cookie Configuration

Secure session management with HTTP-only cookies:

```typescript
export default {
  config: {
    auth: {
      cookie: {
        domain: undefined, // Uses current domain
        path: '/',
        sameSite: 'lax', // strict | lax | none
        secure: true, // HTTPS only
        httpOnly: true, // Prevents XSS
        expires: 604800, // 1 week in seconds
        partitioned: false, // CHIPS partitioned cookie
        renew: true, // Sliding session (refresh on activity)
        pathSuccess: '/', // Redirect after login
        pathLoggedOut: '/', // Redirect after logout
      },
    },
  },
};
```

**Sliding Session:** When `renew: true`, cookie expiration resets on every authenticated request. Session expires after inactivity period, not absolute time.

## Create Users

### CLI (Recommended for First User)

```bash
npx bknd user create
```

Prompts for email, password, and role.

### Programmatic

```typescript
import { createApp } from 'bknd';

const app = createApp(config);
await app.build();

const user = await app.auth.createUser({
  email: 'admin@example.com',
  password: 'securepassword',
  role: 'admin',
});
```

### OAuth Users

OAuth users are created automatically on first login. No manual creation needed.

## Current User

Get authenticated user data:

```bash
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

Response:
```json
{ "user": { "id": 1, "email": "...", "role": "user" } }
```

Returns `403` if not authenticated.

## DOs and DON'Ts

### DO

- Set `jwt.expires` for defense-in-depth security
- Use `httpOnly: true` to prevent XSS attacks
- Enable `renew: true` for sliding sessions
- Use environment variables for secrets
- Configure `sameSite: 'lax'` or `'strict'` to prevent CSRF
- Use `secure: true` in production (HTTPS)
- Set reasonable cookie expiration (1-7 days typical)

### DON'T

- Use plain text password hashing in production
- Store JWT secrets in code
- Set `cookie.sameSite: 'none'` unless you need cross-site cookies
- Disable `httpOnly` - this exposes session to XSS
- Set extremely short cookie expiration without `renew: true`
- Use `implicit_allow: true` for roles unless absolutely necessary
- Store passwords directly - use `app.auth.createUser` for hashing
