import { css, Style } from 'hono/css'
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
        <Style>{css`
          [un-cloak] {
            display: none;
          }
        `}</Style>
        <link href="https://cdn.jsdelivr.net/npm/semantics-ui@latest/dist/semantics-ui.css" type="text/css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>
        <script src="https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.6/bundles/datastar.js" type="module"></script>
        {head}
      </head>
      <body un-cloak>{children}</body>
    </html>
  )
}
