import { createRuntimeApp } from 'bknd/adapter'
import { em, entity, text } from 'bknd'
import { sqlite } from 'bknd/adapter/sqlite'
import type { BkndConfig } from 'bknd'
import { syncTypes, timestamps } from 'bknd/plugins'
import { Api } from 'bknd/client'
import type { Context } from 'hono'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import type { CodeMode } from 'bknd/modes'
import { writer } from 'bknd/adapter/bun'

const connection = sqlite({ url: 'file:./data.db' })
const config = {
  connection,
  config: {
    data: em({
      posts: entity('posts', {
        content: text(),
      }),
    }).toJSON(),
  },
  onBuilt: async (app) => {
    // This can only really run locally because it requires
    // file access...
    try {
      await app.em.schema().sync({ force: true })
    } catch (e) {
      console.error(e)
    }
  },
  options: {
    mode: 'code',
    plugins: [
      timestamps({
        // the entities to add timestamps to
        entities: ['posts'],
        // whether to set the `updated_at` field on create, defaults to true
        setUpdatedOnCreate: true,
      }),

      syncTypes({
        // whether to enable the plugin, make sure to disable in production
        enabled: true,
        // your writing function (required)
        write: async (et) => {
          await Bun.write('bknd-types.d.ts', et.toString())
        },
      }),
    ],
  },
  adminOptions: {
    adminBasepath: '/admin',
    logoReturnPath: '/../',
  },
  writer,
  typesFilePath: 'src/bknd-types.d.ts',
  isProduction: process.env?.PROD === 'true',
  syncSchema: {
    force: true,
    drop: true,
  },
} as CodeMode<BkndConfig>

export async function getBkndApp(context: Context) {
  const app = await createRuntimeApp(config, context)
  return app
}

export async function bkndAppFetch(context: Context) {
  const app = await getBkndApp(context)
  return app.fetch(context.req.raw)
}

export async function getApi(context: Context) {
  const bkndApp = await getBkndApp(context)
  const api = new Api({
    fetcher: bkndApp.server.request as typeof fetch,
  })
  return api
}

export const bkndApp = new Hono()

bkndApp.use('/assets/*', serveStatic({ root: './node_modules/bknd/dist/static' }))
bkndApp.all('/api/*', async (c) => bkndAppFetch(c))
bkndApp.get('/admin', async (c) => bkndAppFetch(c))
bkndApp.get('/admin/*', async (c) => bkndAppFetch(c))
