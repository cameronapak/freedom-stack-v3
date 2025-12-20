import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web'
import { type Context, Hono } from 'hono'
import { bkndApp, getApi } from '../bknd.ts'
import { PostItem } from './components/post-item.tsx'
import { Layout } from './layouts'

const app = new Hono()

app.route('/', bkndApp)
app.get('/', async (c) => {
  const bkndApi = await getApi(c)
  const { data: posts } = await bkndApi.data.readMany('posts', {
    limit: 500,
    sort: '-created_at',
  })

  return c.html(
    <Layout>
      <section data-signals:content="''" class="flex flex-col gap-4 grow p-6">
        <h1 class="text-4xl font-bold">Microblog</h1>
        <div class="flex flex-wrap items-center gap-2">
          <a href="/admin" class="btn">
            Admin
          </a>
        </div>

        <form data-on:submit="@post('/create-post')" class="form grid gap-6 mb-6">
          <textarea
            data-bind="content"
            data-on:keydown="if(event.key==='Enter' && !event.shiftKey) { event.preventDefault(); event.target.closest('form').requestSubmit(); }"
            placeholder="What's on your mind?"
            rows={3}
            class="textarea"
          ></textarea>

          <button type="submit" class="btn">
            Post
          </button>
        </form>

        <div id="posts-container">
          {posts && posts.length > 0 ? (
            <ul id="posts" class="flex flex-col gap-4">
              {posts.map((post) => {
                return <PostItem postId={post.id} key={post.id} content={post.content as string} createdAt={post.created_at as string} />
              })}
            </ul>
          ) : (
            <div
              id="empty-state"
              class="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12 text-neutral-800 dark:text-neutral-300"
            >
              <header class="flex max-w-sm flex-col items-center gap-2 text-center">
                <div class="mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <title>Trash</title>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium tracking-tight">No Posts Yet</h3>
                <p class="text-muted-foreground text-sm/relaxed">
                  You haven't created any posts yet. Share your thoughts with your first microblog post!
                </p>
              </header>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
})

app.post('/create-post', async (c: Context) => {
  const reader = await ServerSentEventGenerator.readSignals(c.req.raw)

  if (!reader.success) {
    console.error('Error reading signals:', reader.error)
    return
  }

  if (reader.signals.content) {
    const bkndApi = await getApi(c)
    const post = await bkndApi.data.createOne('posts', {
      content: reader.signals.content,
    })

    return ServerSentEventGenerator.stream((stream) => {
      // If posts list already exists, prepend the new post to it
      stream.patchElements(
        (<PostItem postId={post.id} content={reader.signals.content as string} createdAt={post.created_at as string} />).toString(),
        {
          selector: '#posts',
          mode: 'prepend',
        }
      )

      // If empty state exists, replace it with posts list containing the new post
      stream.patchElements(
        (
          <ul id="posts" class="flex flex-col gap-4">
            <PostItem postId={post.id} content={reader.signals.content as string} createdAt={post.created_at as string} />
          </ul>
        ).toString(),
        {
          selector: '#empty-state',
          mode: 'replace',
        }
      )

      stream.patchSignals(JSON.stringify({ content: '' }))
    })
  }
})

app.delete('/delete-post/:postId', async (c: Context) => {
  const postId = c.req.param('postId')

  if (!postId) {
    return c.json({ error: 'Post ID is required' }, 400)
  }

  try {
    const bkndApi = await getApi(c)
    await bkndApi.data.deleteOne('posts', postId)

    // Check remaining posts count
    const { data: remainingPosts } = await bkndApi.data.readMany('posts', {
      limit: 500,
    })

    const remainingCount = remainingPosts?.length || 0

    return ServerSentEventGenerator.stream((stream) => {
      if (remainingCount === 0) {
        // Replace entire posts container content with empty state
        stream.patchElements(
          (
            <div
              id="empty-state"
              class="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12 text-neutral-800 dark:text-neutral-300"
            >
              <header class="flex max-w-sm flex-col items-center gap-2 text-center">
                <div class="mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium tracking-tight">No Posts Yet</h3>
                <p class="text-muted-foreground text-sm/relaxed">
                  You haven't created any posts yet. Share your thoughts with your first microblog post!
                </p>
              </header>
            </div>
          ).toString(),
          {
            selector: '#posts-container',
            mode: 'inner',
          }
        )
      } else {
        // Just remove the post element
        stream.patchElements('', {
          selector: `#post-${postId}`,
          mode: 'remove',
        })
      }
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return c.json({ error: 'Failed to delete post' }, 500)
  }
})

app.notFound((c) => {
  return c.html(`Path not found: ${c.req.url}`)
})

export default {
  port: 3000,
  fetch: app.fetch,
}
