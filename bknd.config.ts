import { em, entity, text } from 'bknd'
import { sqlite } from 'bknd/adapter/sqlite'
import { timestamps } from 'bknd/plugins'
import { code } from 'bknd/modes'
import { secureRandomString } from 'bknd/utils'
import { type BunBkndConfig, writer } from 'bknd/adapter/bun'

const config = code<BunBkndConfig>({
  connection: sqlite({ url: 'file:data.db' }),
  config: {
    data: em(
      {
        posts: entity('posts', {
          content: text().required(),
          url: text(),
        }),
      }
      // Bug: this fails because `Field "created_at" not found on entity "posts"`
      // This may be a race condition of the timestamps plugin and indexing
      // ({ index }, { posts }) => {
      //   index(posts).on(['created_at'])
      // }
    ).toJSON(),
    auth: {
      allow_register: true,
      enabled: true,
      jwt: {
        issuer: 'bknd-astro-example',
        secret: secureRandomString(64),
      },
      guard: {
        enabled: true,
      },
      roles: {
        admin: {
          implicit_allow: true,
        },
        default: {
          permissions: [
            'system.access.api',
            'data.database.sync',
            'data.entity.create',
            'data.entity.delete',
            'data.entity.update',
            'data.entity.read',
            'media.file.delete',
            'media.file.read',
            'media.file.list',
            'media.file.upload',
          ],
          is_default: true,
        },
      },
    },
  },
  options: {
    plugins: [
      timestamps({
        // the entities to add timestamps to
        entities: ['posts'],
        // whether to set the `updated_at` field on create, defaults to true
        setUpdatedOnCreate: true,
      }),
    ],
    seed: async (ctx) => {
      // create an admin user
      await ctx.app.module.auth.createUser({
        email: 'admin@example.com',
        password: 'password',
        role: 'admin',
      })

      // create a user
      await ctx.app.module.auth.createUser({
        email: 'user@example.com',
        password: 'password',
        role: 'default',
      })

      await ctx.em.mutator('posts').insertMany([
        { content: 'Just shipped a new feature! The feeling of deploying something you built from scratch never gets old.' },
        {
          content: 'Hot take: TypeScript is just documentation that happens to compile.',
          url: 'https://twitter.com/example/status/123',
        },
        { content: 'Today I learned that SQLite can handle way more than most people think. Millions of rows? No problem.' },
        { content: 'Reading "Designing Data-Intensive Applications" for the third time. Still finding new insights.' },
        { content: "Simplicity is the ultimate sophistication. Delete that abstraction you don't need yet." },
        { content: "Coffee count today: ☕☕☕☕ (it's only 2pm)" },
        {
          content: 'The best code is no code. The second best is code someone else already wrote and tested.',
          url: 'https://github.com/bknd-io/bknd',
        },
        {
          content:
            'Debugging tip: explain the problem to a rubber duck. If that fails, explain it to a coworker. If that fails, take a walk.',
        },
      ])
    },
  },
  writer,
  typesFilePath: 'bknd-types.d.ts',
  isProduction: process.env?.PROD === 'true',
  syncSchema: {
    force: true,
    drop: true,
  },
  adminOptions: {
    adminBasepath: '/admin',
    logoReturnPath: '/../',
  },
})

export default config
