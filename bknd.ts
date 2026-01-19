import { createRuntimeApp } from 'bknd/adapter'
import type { Context } from 'hono'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import config from './bknd.config'

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
bkndApp.use('/uploads/*', serveStatic({ root: './' }))
bkndApp.all('/api/*', async (c) => bkndAppFetch(c))
bkndApp.get('/admin', async (c) => bkndAppFetch(c))
bkndApp.get('/admin/*', async (c) => bkndAppFetch(c))
