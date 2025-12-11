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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/franken-ui@2.1.1/dist/css/core.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/franken-ui@2.1.1/dist/css/utilities.min.css" />
        {head}
      </head>
      <body>{children}</body>
    </html>
  )
}
