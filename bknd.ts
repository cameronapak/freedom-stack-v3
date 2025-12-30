import { createRuntimeApp } from 'bknd/adapter'
import { em, entity, text } from 'bknd'
import { sqlite } from 'bknd/adapter/sqlite'
import type { BkndConfig } from 'bknd'
import { timestamps } from 'bknd/plugins'
import { Api } from 'bknd/client'
import type { Context } from 'hono'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { hybrid, type HybridMode } from 'bknd/modes'
import { writer, reader } from 'bknd/adapter/bun'

const connection = sqlite({ url: 'file:./data.db' })
const config = hybrid({
  // In bknd v0.19.0, there's a bug where timestamps plugin isn't
  // applied unless the app bknd config is wrapped in an app function
  // {@see https://discord.com/channels/1308395750564302952/1450763950173196445/1451931602589581363}
  app: () => ({
    connection,
    config: {
      data: em(
        {
          posts: entity('posts', {
            content: text(),
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
    },
    writer,
    reader,
    typesFilePath: 'bknd-types.d.ts',
    configFilePath: 'bknd-config.json',
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
} as HybridMode<BkndConfig>)

let bkndRuntimeAppInstance: Awaited<ReturnType<typeof createRuntimeApp>> | null = null
let apiInstance: Api | null = null

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

export async function getApi(context: Context) {
  const bkndApp = await getBkndApp(context)
  if (!apiInstance) {
    apiInstance = new Api({
      fetcher: bkndApp.server.request as typeof fetch,
    })
  }
  return apiInstance
}

export const bkndApp = new Hono()

bkndApp.use('/assets/*', serveStatic({ root: './node_modules/bknd/dist/static' }))
bkndApp.all('/api/*', async (c) => bkndAppFetch(c))
bkndApp.get('/admin', async (c) => bkndAppFetch(c))
bkndApp.get('/admin/*', async (c) => bkndAppFetch(c))
