import { Hono } from 'hono'
import { Layout } from './layouts'
import { bkndAppFetch } from '../bknd.ts'

const app = new Hono()

app.all('/api/*', async (c) => bkndAppFetch(c.req.raw))
app.get('/admin', async (c) => bkndAppFetch(c.req.raw))
app.get('/admin/*', async (c) => bkndAppFetch(c.req.raw))

app.get('/', (c) =>
  c.html(
    <Layout>
      <section class="p-6">
        <h1>Hello!</h1>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="uk-btn uk-btn-default">
            Default
          </button>
          <button type="button" class="uk-btn uk-btn-ghost">
            Ghost
          </button>
          <button type="button" class="uk-btn uk-btn-primary">
            Primary
          </button>
          <button type="button" class="uk-btn uk-btn-secondary">
            Secondary
          </button>
          <button type="button" class="uk-btn uk-btn-destructive">
            Destructive
          </button>
          <button type="button" class="uk-btn uk-btn-text">
            Text
          </button>
        </div>
      </section>
    </Layout>
  )
)

app.notFound((c) => {
  return c.html(`Path not found: ${c.req.url}`)
})

export default {
  port: 3000,
  fetch: app.fetch,
}
