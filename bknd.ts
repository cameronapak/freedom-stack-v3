import { createRuntimeApp, serveStaticViaImport } from 'bknd/adapter'
import { em, entity, boolean, text } from 'bknd'
import { sqlite } from 'bknd/adapter/sqlite'
import type { App } from 'bknd'
import { Api } from 'bknd/client'

const connection = sqlite({ url: ':memory:' })

export async function getBkndApp() {
  const app = await createRuntimeApp({
    connection,
    config: {
      data: em({
        todos: entity('todos', {
          title: text(),
          done: boolean(),
        }),
      }).toJSON(),
    },
    serveStatic: serveStaticViaImport(),
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
    },
    adminOptions: {
      adminBasepath: '/admin',
      logoReturnPath: '/../',
    },
  })
  return app
}

export async function bkndAppFetch(request: Request) {
  const app = await getBkndApp()
  return app.fetch(request)
}

export async function getApi(app: App) {
  const api = new Api({
    fetcher: app.server.request as typeof fetch,
  })
  return api
}
