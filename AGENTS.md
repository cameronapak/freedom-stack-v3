## BUILD & DEVELOPMENT
- Start dev server: `bun run dev`
- No test framework configured
- No linting configured
- Uses Bun runtime

## CODE STYLE
- TypeScript with strict mode enabled
- Use Hono JSX for components
- Import style: `import { Type } from 'module'` on separate lines
- Component exports: `export function ComponentName()`
- Props interface: `type Props = { ... }`
- File naming: kebab-case for files (todo-list-item.tsx)
- Use CSS classes via UnoCSS/Basecoat patterns
- Error handling: simple console.error for debugging
- Keep components single-responsibility
- Use async/await for API calls
- No complex abstractions - prefer direct solutions

## ADDITIONAL CONTEXT

When needing additional context, use web search, context7 MCP, or grep.app MCP tool calls to dig deeper. 

- [Hono](https://hono.dev/llms.txt)
- [BasecoatCSS](https://basecoatui.com/llms.txt)
- [BasecoatCSS Kitchen Sink of Components](https://basecoatui.com/kitchen-sink/)
- [Datastar](https://data-star.dev/docs)
- [Bknd](https://docs.bknd.io/llms-full.txt)
