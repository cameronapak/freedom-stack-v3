import { Trash } from '../components/icons/trash.tsx'

type Props = {
  postId: string
  content: string
  createdAt?: string | Date
}

export function PostItem({ postId, content, createdAt }: Props) {
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
    <li id={`post-${postId}`} class="card p-4 border rounded-lg relative">
      <div class="flex flex-col gap-2">
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm leading-relaxed flex-1">{content}</p>
          <button
            data-on:click={`if(confirm('Are you sure you want to delete this post?')) { @delete('/delete-post/${postId}') }`}
            class="btn btn-sm"
            type="button"
            aria-label="Delete post"
          >
            <Trash />
          </button>
        </div>
        {createdAt && <time class="text-xs text-muted-foreground">{formatDate(createdAt)}</time>}
      </div>
    </li>
  )
}
