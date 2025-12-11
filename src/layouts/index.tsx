import type { FC, PropsWithChildren } from 'hono/jsx'
import type { Child } from 'hono/jsx/dom'

type Props = {
  title?: string
  head?: Child
}

export const Layout: FC = ({ title = 'Home', children, head = null }: PropsWithChildren<Props>) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        {head}
      </head>
      <body>{children}</body>
    </html>
  )
}
