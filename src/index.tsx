import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { Layout } from './layouts'
import { bkndAppFetch } from '../bknd.ts'

const app = new Hono()

app.use('/assets/*', serveStatic({ root: './node_modules/bknd/dist/static' }))
app.all('/api/*', async (c) => bkndAppFetch(c))
app.get('/admin', async (c) => bkndAppFetch(c))
app.get('/admin/*', async (c) => bkndAppFetch(c))

app.get('/', (c) =>
  c.html(
    <Layout>
      <section class="p-6">
        <h1>Hello!</h1>
        <div class="flex flex-wrap items-center gap-2">
          <a href="/admin" class="uk-btn uk-btn-default">
            Admin
          </a>
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
