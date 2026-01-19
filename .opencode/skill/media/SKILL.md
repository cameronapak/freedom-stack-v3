---
name: media
description: Use when configuring media file handling, setting up storage adapters, defining entity-media relationships (one-to-one, one-to-many), uploading files, and working with polymorphic media relations. Covers media module configuration, storage backends, and the Media API.
---

# Media Handling in Bknd

Bknd's media system provides file upload, storage, and management through polymorphic relationships. Connect media to any entity in your schema with flexible association patterns.

## What You'll Learn

- Enable media module with storage adapters
- Define entity-media relationships
- Upload files to entity fields
- Query entities with media
- Manage media attachments

## Quick Start

```bash
npm install bknd
```

Enable media with local storage:

```typescript
import { em, entity, text, systemEntity, medium, media } from "bknd";
import { serve } from "bknd/adapter/node";

const schema = em({
  posts: entity("posts", {
    title: text().required(),
    cover: medium(),  // One-to-one
    gallery: media(),  // One-to-many
  }),
  media: systemEntity("media", {}),
}, ({ relation }, { posts, media }) => {
  relation(posts).polyToOne(media, { mappedBy: "cover" });
  relation(posts).polyToMany(media, { mappedBy: "gallery" });
});

export default serve({
  config: {
    data: schema.toJSON(),
    media: {
      enabled: true,
      adapter: {
        type: "local",
        config: { path: "./uploads" },
      },
    },
  },
});
```

## Media Configuration

### Local Storage (Node.js)

```typescript
import { serve } from "bknd/adapter/node";

export default serve({
  config: {
    media: {
      enabled: true,
      adapter: {
        type: "local",
        config: { path: "./public/uploads" },
      },
    },
  },
});
```

**Environment Variables:**
- None required for local storage

### S3 Storage

```typescript
import { serve } from "bknd/adapter/node";

export default serve({
  config: {
    media: {
      enabled: true,
      adapter: {
        type: "s3",
        config: {
          access_key: process.env.AWS_ACCESS_KEY_ID,
          secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
          url: "https://my-bucket.s3.amazonaws.com",
        },
      },
    },
  },
});
```

**Environment Variables:**
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

**Note:** The `url` should be the full S3 endpoint with bucket name. For Cloudflare R2, use format like `https://{account_id}.r2.cloudflarestorage.com/{bucket}`.

### Custom Adapters

Create custom storage adapters by implementing the MediaAdapter interface:

```typescript
import { createApp } from "bknd";

export default createApp({
  config: {
    media: {
      enabled: true,
      adapter: {
        upload: async (file: File) => { /* custom logic */ },
        delete: async (url: string) => { /* custom logic */ },
        getUrl: (path: string) => `https://cdn.example.com/${path}`,
      },
    },
  },
});
```

## Entity-Media Relationships

Media uses **polymorphic relations** to connect to any entity. The media entity is a system entity with fields tracking ownership (`entity_id`, `reference`).

### One-to-One Relations

Use for single media items: avatars, cover images, thumbnails.

```typescript
import { em, entity, text, systemEntity, medium } from "bknd";

const schema = em({
  users: entity("users", {
    username: text().required(),
    avatar: medium(),  // Virtual field
  }),
  media: systemEntity("media", {}),
}, ({ relation }, { users, media }) => {
  relation(users).polyToOne(media, { mappedBy: "avatar" });
});
```

**Operations:**

For Code Mode (recommended), use API endpoints:

```typescript
// Create with media
await api.data.createOne("users", {
  username: "john",
  avatar: { $create: { file: uploadedFile } },
});

// Set existing media
await api.data.updateOne("users", 1, {
  avatar: { $set: { id: mediaId } },
});

// Query with media
const user = await api.data.readOneBy("users", {
  where: { id: 1 },
  with: { avatar: true },
});
```

For Hybrid Mode (direct database access):

```typescript
// After app.build()
const app = createApp(config);
await app.build();

// Create with media
await app.em.mutator("users").insertOne({
  username: "john",
  avatar: { $create: { file: uploadedFile } },
});

// Set existing media
await app.em.mutator("users").updateOne(1, {
  avatar: { $set: { id: mediaId } },
});

// Query with media
const user = await app.em.repository("users").findOne({
  where: { id: 1 },
  with: { avatar: true },
});
```

### One-to-Many Relations

Use for collections: galleries, attachments, documents.

```typescript
import { em, entity, text, systemEntity, media } from "bknd";

const schema = em({
  products: entity("products", {
    name: text().required(),
    images: media(),  // Virtual field
  }),
  media: systemEntity("media", {}),
}, ({ relation }, { products, media }) => {
  relation(products).polyToMany(media, { mappedBy: "images" });
});
```

**Operations:**

For Code Mode (recommended), use API endpoints:

```typescript
// Create with media
await api.data.createOne("products", {
  name: "Laptop",
  images: {
    $create: [
      { file: image1 },
      { file: image2 },
    ],
  },
});

// Add more images
await api.data.updateOne("products", 1, {
  images: {
    $append: { file: image3 },
  },
});

// Remove image
await api.data.updateOne("products", 1, {
  images: {
    $remove: imageId,
  },
});

// Query with media
const product = await api.data.readOneBy("products", {
  where: { id: 1 },
  with: { images: { limit: 5 } },
});
```

For Hybrid Mode (direct database access):

```typescript
// After app.build()
const app = createApp(config);
await app.build();

// Create with media
await app.em.mutator("products").insertOne({
  name: "Laptop",
  images: {
    $create: [
      { file: image1 },
      { file: image2 },
    ],
  },
});

// Add more images
await app.em.mutator("products").updateOne(1, {
  images: {
    $append: { file: image3 },
  },
});

// Remove image
await app.em.mutator("products").updateOne(1, {
  images: {
    $remove: imageId,
  },
});

// Query with media
const product = await app.em.repository("products").findOne({
  where: { id: 1 },
  with: { images: { limit: 5 } },
});
```

### Multiple Media Relations

Define multiple media fields on a single entity:

```typescript
const schema = em({
  products: entity("products", {
    name: text().required(),
    thumbnail: medium(),   // One-to-one
    gallery: media(),      // One-to-many
    documents: media(),    // One-to-many
  }),
  media: systemEntity("media", {}),
}, ({ relation }, { products, media }) => {
  relation(products).polyToOne(media, { mappedBy: "thumbnail" });
  relation(products).polyToMany(media, { mappedBy: "gallery" });
  relation(products).polyToMany(media, { mappedBy: "documents" });
});
```

### Many-to-Many Relations

Media inherently supports sharing across entities:

```typescript
const schema = em({
  posts: entity("posts", {
    title: text().required(),
    images: media(),
  }),
  pages: entity("pages", {
    slug: text().required(),
    images: media(),
  }),
  media: systemEntity("media", {}),
}, ({ relation }, { posts, pages, media }) => {
  relation(posts).polyToMany(media, { mappedBy: "images" });
  relation(pages).polyToMany(media, { mappedBy: "images" });
});
```

## Media API: uploadToEntity

Upload files directly to entity fields without manual relation management:

```typescript
// Using TypeScript SDK (client)
const { data, error } = await api.media.uploadToEntity(
  "users",      // entity name
  userId,       // entity ID
  "avatar",     // field name
  file,         // File, Buffer, or ReadableStream
  { overwrite: true }  // options (optional)
);
```

**Signature:**

```typescript
await media.uploadToEntity(
  entity: string,
  id: PrimaryFieldType,
  field: string,
  item: File | Buffer | ReadableStream,
  options?: {
    overwrite?: boolean;  // Replace existing file
    _init?: RequestInit;
    fetcher?: typeof fetch;
  }
);
```

**Overwrite Behavior:**

```typescript
// Default: Error if file exists
const result = await media.uploadToEntity("users", userId, "avatar", file);
// Error: File already exists for users[userId].avatar

// Allow overwriting
const result = await media.uploadToEntity("users", userId, "avatar", file, {
  overwrite: true
});
// Success: Replaces existing file
```

**Use Cases:**

```typescript
// Profile picture updates
await media.uploadToEntity("users", userId, "avatar", avatarFile, {
  overwrite: true
});

// Cover image replacement
await media.uploadToEntity("posts", postId, "cover", newCoverImage, {
  overwrite: true
});

// Document upload
await media.uploadToEntity("contracts", contractId, "pdf", pdfBuffer);
```

## Querying with Media

### Filter by Media Fields

```typescript
// Find posts with cover image
const postsWithCover = await api.data.readMany("posts", {
  where: { 'cover.mime_type': { $isnull: false } }
});
// Auto-joins media table

// Find products with specific image type
const products = await api.data.readMany("products", {
  where: { 'gallery.mime_type': { $like: 'image/%' } }
});
```

### Multiple Media Relations

```typescript
// Find posts with cover image AND large thumbnail
const posts = await api.data.readMany("posts", {
  where: {
    'cover.mime_type': { $like: 'image/%' },
    'thumbnail.width': { $gte: 1200 }
  }
});
```

### Performance Notes

**Auto-join warnings:**
```typescript
// Warning if media field not indexed
const posts = await api.data.readMany("posts", {
  where: { 'cover.mime_type': 'image/jpeg' }
});
// Warning: Field "media.mime_type" used in "where" is not indexed
```

**Explicit join for better control:**
```typescript
// Auto-join: Loads all media columns
const posts = await api.data.readMany("posts", {
  where: { 'cover.mime_type': 'image/jpeg' }
});

// Explicit join: Load only needed columns
const postsOptimized = await api.data.readMany("posts", {
  join: ['cover'],
  select: ['id', 'title', 'cover.mime_type', 'cover.width'],
  where: { 'cover.mime_type': 'image/jpeg' }
});
```

## Media Entity Fields

The system media entity includes these fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | primary | Unique identifier |
| `entity_id` | text | Owning entity ID |
| `reference` | text | Entity name and field |
| `path` | text | File path |
| `folder` | boolean | Is directory |
| `mime_type` | text | File MIME type |
| `size` | number | File size in bytes |
| `scope` | text | Field name (hidden) |
| `etag` | text | File hash |
| `modified_at` | date | Last modified timestamp |
| `metadata` | json | Metadata (includes width/height for images) |

## Complete Example: E-Commerce Product

```typescript
import { em, entity, text, number, systemEntity, medium, media } from "bknd";
import { serve } from "bknd/adapter/node";

const schema = em({
  products: entity("products", {
    name: text().required(),
    description: text(),
    price: number(),
    thumbnail: medium(),   // Single preview image
    gallery: media(),      // Product images
    documents: media(),    // Manuals, specs
  }),
  media: systemEntity("media", {}),
}, ({ relation }, { products, media }) => {
  relation(products).polyToOne(media, { mappedBy: "thumbnail" });
  relation(products).polyToMany(media, { mappedBy: "gallery" });
  relation(products).polyToMany(media, { mappedBy: "documents" });
});

export default serve({
  config: {
    data: schema.toJSON(),
    media: {
      enabled: true,
      adapter: {
        type: "local",
        config: { path: "./uploads" },
      },
    },
  },
});
```

```typescript
// Create product with all media
const product = await app.em.mutator("products").insertOne({
  name: "Laptop",
  description: "Powerful laptop",
  price: 999,
  thumbnail: { $create: { file: thumbFile } },
  gallery: {
    $create: [
      { file: image1 },
      { file: image2 },
      { file: image3 },
    ],
  },
  documents: {
    $create: [
      { file: manualFile },
      { file: warrantyFile },
    ],
  },
});

// Query product with all media
const fullProduct = await app.em.repository("products").findOne({
  where: { id: product.id },
  with: {
    thumbnail: true,
    gallery: { sort: "-created_at" },
    documents: { where: { mime_type: { $like: "application/%" } } },
  },
});
```

## DOs and DON'Ts

**DO:**
- Use `medium()` for one-to-one (avatar, cover, thumbnail)
- Use `media()` for one-to-many (gallery, attachments)
- Sort media with `sort` option for consistent display
- Filter media by type (`mime_type`, file extensions)
- Use `uploadToEntity` for direct field uploads
- Index media fields used in queries

**DON'T:**
- Use `$attach`/`$detach` with `medium()` (one-to-one)
- Use `$set` with `media()` for partial updates (use `$attach`/`$detach`)
- Load large media tables without explicit `select`
- Forget to use `with` parameter when querying media
- Ignore auto-join warnings about unindexed fields
- Store sensitive data in media files

## Common Issues

**Media not appearing in queries:**
```typescript
// Wrong - media not loaded
const post = await api.data.readMany("posts", {
  limit: 1,
  where: { id: 1 },
});

// Correct - load media with with: {}
const post = await api.data.readOneBy("posts", {
  where: { id: 1 },
  with: { cover: true },
});
```

**Relation not working:**
```typescript
// Missing relation mapping
relation(posts).polyToOne(media, { mappedBy: "cover" });
// Virtual field must match mappedBy
cover: medium(),
```

**Wrong operation type:**
```typescript
// One-to-one: Use $set, not $attach
await app.em.mutator("users").updateOne(1, {
  avatar: { $set: { id: mediaId } },
});

// One-to-many: Use $attach/$detach, not just $set
await app.em.mutator("products").updateOne(1, {
  gallery: {
    $attach: [mediaId1, mediaId2],
  },
});
```
