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

## AI TOOL USAGE

### Zero-Setup MCP Configuration

This repository includes **automatic MCP (Model Context Protocol)** configurations using the **official Upstash Context7 implementation**. Both MCP servers work immediately when you open the repo—no setup required.

**Available Tools:**
- **context7** - Official Upstash Context7 MCP (auto-installs via `npx @upstash/context7-mcp@latest`)
  - Access documentation for Datastar, BasecoatCSS, Hono, Bknd, and more
  - No API key required - works immediately
  - Docs: https://context7.com | https://github.com/upstash/context7

- **grep.app** - Search GitHub code (via `https://mcp.grep.app`)
  - Find real-world implementation examples
  - No authentication needed

**How it works:**
- Cursor reads `.cursor/mcp.json` automatically
- OpenCode reads `.opencode/opencode.json` automatically
- Context7 auto-installs on first use via npx
- Zero manual configuration required

### Effective Prompts

**When you need documentation or concepts:**
```
"Use context7 to explain Datastar's data-store directive and state management"
"Look up BasecoatCSS spacing utilities and responsive design patterns"
"Find Hono's documentation on JSX components and props handling"
```

**When you need implementation examples:**
```
"Use grep.app to find examples of data-on:click usage in Datastar applications"
"Search for BasecoatCSS button component implementations with hover states"
"Find examples of Hono JSX components with form handling"
```

## DATASTAR PATTERNS

Datastar is a hypermedia framework for interactive UIs using HTML attributes.

**Key Directives:**
- `data-store` - Define reactive state
- `data-on:*` - Event handlers (use colon, not hyphen)
- `data-text`, `data-show` - Reactive updates
- `data-on:load` - Load data via SSE endpoints

**Component with Local State:**
```tsx
<div data-store="{ count: 0 }">
  <button data-on:click="count++">Increment</button>
  <span data-text="count"></span>
</div>
```

**Server-Sent Events:**
```tsx
<div data-on:load="sse:/api/updates">
  <div data-text="message"></div>
</div>
```

**Form Validation:**
```tsx
<form data-store="{ email: '', error: '' }">
  <input 
    type="email"
    data-model="email"
    data-on:blur="validateEmail()"
  />
  <span data-text="error" data-show="error"></span>
</form>
```

## BASECOATCSS PATTERNS

BasecoatCSS is a utility-first CSS framework with semantic components.

**Core Concepts:**
- **Utilities**: `p-4`, `text-lg`, `bg-primary`, `flex`, `grid`
- **Components**: `.button`, `.card`, `.form-group`, `.form-input`
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` prefixes

**Button Component:**
```tsx
<button class="button button-primary">
  Click me
</button>
```

**Card Layout:**
```tsx
<div class="card p-4 shadow-md">
  <h3 class="text-xl font-bold mb-2">Card Title</h3>
  <p class="text-gray-600">Card content</p>
</div>
```

**Responsive Grid:**
```tsx
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

## COMBINING DATASTAR + BASECOATCSS

**Interactive Card:**
```tsx
<div class="card p-4" data-store="{ isOpen: false }">
  <button 
    class="button button-primary"
    data-on:click="isOpen = !isOpen"
  >
    Toggle
  </button>
  <div 
    class="mt-4 p-4 bg-gray-100 rounded"
    data-show="isOpen"
  >
    Hidden content
  </div>
</div>
```

**Form with Validation:**
```tsx
<form class="form" data-store="{ email: '', error: '' }">
  <div class="form-group">
    <label class="form-label">Email</label>
    <input 
      type="email"
      class="form-input"
      data-model="email"
      data-on:blur="validateEmail()"
    />
    <span class="text-error" data-text="error" data-show="error"></span>
  </div>
  <button class="button button-primary" type="submit">
    Submit
  </button>
</form>
```

**Todo List:**
```tsx
<div class="container" data-store="{ todos: [], newTodo: '' }">
  <form class="flex gap-2 mb-4" data-on:submit.prevent="addTodo()">
    <input 
      class="form-input flex-1"
      data-model="newTodo"
      placeholder="Add todo..."
    />
    <button class="button button-primary" type="submit">Add</button>
  </form>
  
  <div class="space-y-2">
    <div 
      class="card p-3 flex items-center gap-2"
      data-for="todo in todos"
    >
      <input 
        type="checkbox"
        data-model="todo.done"
      />
      <span data-text="todo.text"></span>
      <button 
        class="button button-sm button-danger ml-auto"
        data-on:click="removeTodo(todo.id)"
      >
        Delete
      </button>
    </div>
  </div>
</div>
```

## REFERENCE DOCUMENTATION

Use context7 or web search for additional details:

- [Hono](https://hono.dev/llms.txt)
- [BasecoatCSS](https://basecoatui.com/llms.txt)
- [BasecoatCSS Kitchen Sink](https://basecoatui.com/kitchen-sink/)
- [Datastar](https://data-star.dev/docs)
- [Bknd](https://docs.bknd.io/llms-full.txt)
- [Context7](https://context7.com) | [GitHub](https://github.com/upstash/context7)

## TIPS FOR AI ASSISTANTS

1. **Use MCP tools effectively**: grep.app for examples, context7 for concepts
2. **Follow established patterns**: Check existing code before introducing new patterns
3. **Keep it simple**: Prefer direct solutions over abstractions
4. **Use correct syntax**: Datastar uses `data-on:click` with colons, not hyphens
5. **Combine frameworks thoughtfully**: BasecoatCSS for styling, Datastar for interactivity
6. **Trust the stack**: Official Context7 MCP ensures maximum compatibility
