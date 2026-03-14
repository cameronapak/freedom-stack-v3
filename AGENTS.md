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
- Use CSS classes via UnoCSS and Semantics UI patterns
- Error handling: simple console.error for debugging
- Keep components single-responsibility
- Use async/await for API calls
- No complex abstractions - prefer direct solutions

## ADDITIONAL CONTEXT
When needing additional context, you must do deeper research. Here are helper resources.

### Tool Calls

Semantics UI, Datastar, and Bknd are all newer technologies, so you must use `gh_grep` and `context7` MCP tools to do research and get the most up-to-date documentation when you are not certain.

### Resources

- [Hono](https://hono.dev/llms.txt)
- [Semantics UI](https://github.com/cameronapak/semantics-ui)
- [Datastar](https://data-star.dev/docs)
- [Bknd](https://docs.bknd.io/llms-full.txt)
