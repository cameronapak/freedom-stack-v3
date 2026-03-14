import type { Child, JSX } from 'hono/jsx'

type Props = {
  icon: Child
  title: string
  description?: string
} & JSX.IntrinsicElements['div']

export function EmptyState({ icon, title, description, ...props }: Props) {
  return (
    <section {...props} class="py-12 y-stack items-center">
      <div class="mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6">
        {icon}
      </div>
      <div class="y-stack items-center gap-1">
        <h3 class="text-center">{title}</h3>
        {description ? <p class="max-w-sm text-center text-muted-foreground text-balance">{description}</p> : null}
      </div>
    </section>
  )
}
