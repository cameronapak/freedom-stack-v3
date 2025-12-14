import { Hono, type Context } from 'hono'
import { Layout } from './layouts'
import { bkndApp, getApi } from '../bknd.ts'
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web'
import { TodoListItem } from './components/todo-list-item.tsx'

const app = new Hono()

app.route('/', bkndApp)
app.get('/', async (c) => {
  const bkndApi = await getApi(c)
  const { data: todos } = await bkndApi.data.readMany('todos')
  return c.html(
    <Layout>
      <section data-signals:post="''" class="flex flex-col gap-4 grow p-6">
        <h1 class="text-4xl font-bold">Hello!</h1>
        <div class="flex flex-wrap items-center gap-2">
          <a href="/admin" class="btn">
            Admin
          </a>
        </div>

        <ul id="posts">
          {todos?.map((todo) => {
            return <TodoListItem todoId={todo.id} key={todo.id} title={todo.title} checked={todo.done} />
          })}
        </ul>

        <form data-on:submit="@post('/submit-post')" class="form grid gap-6">
          <textarea data-bind="post" placeholder="I like to..." rows={3}></textarea>

          <button type="submit" class="btn">
            Submit
          </button>
        </form>
      </section>
    </Layout>
  )
})

app.post('/submit-post', async (c: Context) => {
  const reader = await ServerSentEventGenerator.readSignals(c.req.raw)
  const bkndApi = await getApi(c)

  if (!reader.success) {
    console.error('Error reading signals:', reader.error)
    return
  }

  if (reader.signals.post) {
    const todo = await bkndApi.data.createOne('todos', {
      title: reader.signals.post,
      done: false,
    })

    return ServerSentEventGenerator.stream((stream) => {
      stream.patchElements((<TodoListItem todoId={todo.id} title={reader.signals.post as string} />).toString(), {
        selector: '#posts',
        mode: 'append',
      })
      stream.patchSignals(JSON.stringify({ post: '' }))
    })
  }
})

app.post('/toggle-todo/:id/:checked', async (c: Context) => {
  const reader = await ServerSentEventGenerator.readSignals(c.req.raw)
  const bkndApi = await getApi(c)

  if (!reader.success) {
    console.error('Error reading signals:', reader.error)
    return
  }

  await bkndApi.data.updateOne('todos', c.req.param('id'), { done: c.req.param('checked') === 'true' })
})

app.notFound((c) => {
  return c.html(`Path not found: ${c.req.url}`)
})

export default {
  port: 3000,
  fetch: app.fetch,
}
