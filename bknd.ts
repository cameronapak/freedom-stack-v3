import { createRuntimeApp } from 'bknd/adapter'
import { em, entity, boolean, text } from 'bknd'
import { sqlite } from 'bknd/adapter/sqlite'
import type { App } from 'bknd'
import { Api } from 'bknd/client'
import type { Context } from 'hono'

const connection = sqlite({ url: ':memory:' })

export async function getBkndApp(context: Context) {
  const app = await createRuntimeApp(
    {
      connection,
      config: {
        data: em({
          todos: entity('todos', {
            title: text(),
            done: boolean(),
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
      },
      adminOptions: {
        adminBasepath: '/admin',
        logoReturnPath: '/../',
      },
    },
    context
  )
  return app
}

export async function bkndAppFetch(context: Context) {
  const app = await getBkndApp(context)
  return app.fetch(context.req.raw)
}

export async function getApi(app: App) {
  const api = new Api({
    fetcher: app.server.request as typeof fetch,
  })
  return api
}
