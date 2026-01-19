import { createRuntimeApp } from 'bknd/adapter'
import { em, entity, text } from 'bknd'
import { sqlite } from 'bknd/adapter/sqlite'
import type { BkndConfig } from 'bknd'
import { timestamps } from 'bknd/plugins'
import type { Context } from 'hono'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { code, type CodeMode } from 'bknd/modes'
import { writer, reader } from 'bknd/adapter/bun'

const connection = sqlite({ url: 'file:./data.db' })
const config = code({
  // In bknd v0.19.0, there's a bug where timestamps plugin isn't
  // applied unless the app bknd config is wrapped in an app function
  // {@see https://discord.com/channels/1308395750564302952/1450763950173196445/1451931602589581363}
  app: () => ({
    connection,
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
    },
    options: {
      mode: 'db',
      plugins: [
        timestamps({
          // the entities to add timestamps to
          entities: ['posts'],
          // whether to set the `updated_at` field on create, defaults to true
          setUpdatedOnCreate: true,
        }),
      ],
      seed: async (ctx) => {
        await ctx.em.mutator('posts').insertMany([
          { content: 'Just shipped a new feature! The feeling of deploying something you built from scratch never gets old.' },
          { content: 'Hot take: TypeScript is just documentation that happens to compile.', url: 'https://twitter.com/example/status/123' },
          { content: 'Today I learned that SQLite can handle way more than most people think. Millions of rows? No problem.' },
          { content: 'Reading "Designing Data-Intensive Applications" for the third time. Still finding new insights.' },
          { content: 'Simplicity is the ultimate sophistication. Delete that abstraction you don\'t need yet.' },
          { content: 'Coffee count today: ☕☕☕☕ (it\'s only 2pm)' },
          { content: 'The best code is no code. The second best is code someone else already wrote and tested.', url: 'https://github.com/bknd-io/bknd' },
          { content: 'Debugging tip: explain the problem to a rubber duck. If that fails, explain it to a coworker. If that fails, take a walk.' },
        ])
      },
    },
    writer,
    reader,
    typesFilePath: 'bknd-types.d.ts',
    // configFilePath: 'bknd-config.json',
    isProduction: process.env?.PROD === 'true',
    syncSchema: {
      force: true,
      drop: true,
    },
  }),
  adminOptions: {
    adminBasepath: '/admin',
    logoReturnPath: '/../',
  },
} as CodeMode<BkndConfig>)

let bkndRuntimeAppInstance: Awaited<ReturnType<typeof createRuntimeApp>> | null = null

export async function getBkndApp(context: Context) {
  if (!bkndRuntimeAppInstance) {
    bkndRuntimeAppInstance = await createRuntimeApp(config, context)
  }
  return bkndRuntimeAppInstance
}

export async function bkndAppFetch(context: Context) {
  const app = await getBkndApp(context)
  return app.fetch(context.req.raw)
}

export async function getApi(context: Context, opts?: { verify?: boolean }) {
  const bkndApp = await getBkndApp(context)
  const api = bkndApp.getApi({
    headers: context.req.raw.headers,
  })

  if (opts?.verify) {
    await api.verifyAuth()
  }

  return api
}

export const bkndApp = new Hono()

bkndApp.use('/assets/*', serveStatic({ root: './node_modules/bknd/dist/static' }))
bkndApp.all('/api/*', async (c) => bkndAppFetch(c))
bkndApp.get('/admin', async (c) => bkndAppFetch(c))
bkndApp.get('/admin/*', async (c) => bkndAppFetch(c))
