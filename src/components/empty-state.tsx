import type { Child, JSX } from 'hono/jsx'

type Props = {
  icon: Child
  title: string
  description?: string
} & JSX.IntrinsicElements['div']

export function EmptyState({ icon, title, description, ...props }: Props) {
  return (
    <div
      {...props}
      class="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12 text-neutral-800 dark:text-neutral-300"
    >
      <header class="flex max-w-sm flex-col items-center gap-2 text-center">
        <div class="mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6">
          {icon}
        </div>
        <h3 class="text-lg font-medium tracking-tight">{title}</h3>
        {description ? <p class="text-muted-foreground text-sm/relaxed">{description}</p> : null}
      </header>
    </div>
  )
}
