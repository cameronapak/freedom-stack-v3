import { css, Style } from 'hono/css'
import type { FC, PropsWithChildren } from 'hono/jsx'
import type { Child } from 'hono/jsx/dom'

type Props = {
  title?: string
  head?: Child
}

export const Layout: FC = ({ title = 'Home', children, head = null }: PropsWithChildren<Props>) => {
  return (
    <html lang="en" class="dark">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <Style>{css`
          [un-cloak] {
            display: none;
          }
        `}</Style>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/basecoat-css@0.3.6/dist/basecoat.cdn.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>
        <script src="https://cdn.jsdelivr.net/npm/basecoat-css@0.3.6/dist/js/all.min.js" defer></script>
        <script type="module" src="https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.6/bundles/datastar.js"></script>
        {head}
      </head>
      <body un-cloak>{children}</body>
    </html>
  )
}
