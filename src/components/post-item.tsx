import { Trash } from '../components/icons/trash.tsx'

type Props = {
  postId: string
  content: string
  createdAt?: string | Date
  url?: string
  showDeleteButton?: boolean
}

export function PostItem({ postId, content, createdAt, url, showDeleteButton = false }: Props) {
  const formatDate = (date?: string | Date) => {
    if (!date) return ''
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d)
  }

  return (
    <li id={`post-${postId}`} class="card w-full border rounded-lg relative">
      <section class="flex flex-col gap-2">
        {url && (
          <a href={url} target="_blank">
            {url}
          </a>
        )}
        <div class="x-stack">
          <p class="grow">{content}</p>
          {showDeleteButton ? (
            <button
              data-on:click={`if(confirm('Are you sure you want to delete this post?')) { @delete('/delete-post/${postId}') }`}
              type="button"
              data-variant="secondary"
              aria-label="Delete post"
            >
              <Trash />
            </button>
          ) : null}
        </div>
        {createdAt && <time class="text-xs text-muted-foreground">{formatDate(createdAt)}</time>}
      </section>
    </li>
  )
}
