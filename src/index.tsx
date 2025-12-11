import { Hono } from 'hono'
import { Layout } from './layouts'

const app = new Hono()

app.get('/', (c) =>
  c.html(
    <Layout>
      <h1>Hello!</h1>
    </Layout>
  )
)

export default {
  port: 3000,
  fetch: app.fetch,
}
