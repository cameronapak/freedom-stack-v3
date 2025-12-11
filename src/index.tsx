import { Hono } from 'hono'
import { Layout } from './layouts'

const app = new Hono()

app.get('/', (c) =>
  c.html(
    <Layout>
      <section class="p-6">
        <h1>Hello!</h1>
        <div class="flex flex-wrap items-center gap-2">
          <button class="uk-btn uk-btn-default">Default</button>
          <button class="uk-btn uk-btn-ghost">Ghost</button>
          <button class="uk-btn uk-btn-primary">Primary</button>
          <button class="uk-btn uk-btn-secondary">Secondary</button>
          <button class="uk-btn uk-btn-destructive">Destructive</button>
          <button class="uk-btn uk-btn-text">Text</button>
        </div>
      </section>
    </Layout>
  )
)

export default {
  port: 3000,
  fetch: app.fetch,
}
