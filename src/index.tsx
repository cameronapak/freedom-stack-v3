import { Hono } from 'hono'
import { Layout } from './layouts'
import { bkndApp } from '../bknd.ts'

const app = new Hono()

app.route('/', bkndApp)
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
