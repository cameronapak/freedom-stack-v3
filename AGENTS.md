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

## AI TOOL USAGE GUIDELINES

### Zero-Setup MCP Configuration ✨

This repository includes **fully automatic MCP (Model Context Protocol) configurations** for both **Cursor** and **OpenCode** using the **official Upstash Context7 implementation**! 

🎉 **No manual setup required. Everything auto-installs and works immediately.**

When you open this repo in Cursor or OpenCode, both MCP servers are automatically configured and fully functional:
- ✅ **context7** - Official Upstash Context7 MCP with automatic installation via npx
- ✅ **grep.app** - Search across all of GitHub for real-world code examples

**Just open the repo and start coding!** The AI tools have immediate access to documentation and code search.

### How It Works

The magic happens automatically using the official Context7 implementation:
- **Cursor** reads `.cursor/mcp.json` when you open the repo
- **OpenCode** reads `.opencode/opencode.json` when you open the repo
- **context7** uses the official `@upstash/context7-mcp` package via npx
- First use automatically installs the package - no manual setup required
- grep.app uses public endpoint - no authentication needed
- Zero manual configuration, zero friction

### Available MCP Tools

Both of these work out of the box with no setup:

1. **context7** (official Upstash implementation via `npx @upstash/context7-mcp@latest`)
   - 🚀 **Official Upstash Context7 MCP** - Maximum compatibility and features
   - 📦 **Auto-installs via npx** - Downloads and runs automatically on first use
   - 🔓 **No API key required initially** - Basic functionality works without authentication
   - ⚡ **Optional API key for enhanced features** - Can add `UPSTASH_VECTOR_REST_URL` and `UPSTASH_VECTOR_REST_TOKEN` later
   - 📖 **Access comprehensive documentation** for frameworks and libraries
   - ✨ **Latest features** - Always up-to-date with `@latest` tag
   - Perfect for understanding core concepts and APIs
   - More info: https://context7.com and https://github.com/upstash/context7

2. **gh-grep** (via `https://mcp.grep.app`)
   - Search across GitHub repositories for code examples
   - No authentication needed
   - Find real-world implementations instantly

### Optional: Enhanced Context7 Features

While Context7 works immediately without configuration, you can optionally add an API key for enhanced features:

1. Visit https://console.upstash.com/vector
2. Create a vector database (if you don't have one)
3. Copy your REST URL and token
4. Add to your environment (optional - only needed for enhanced features):
   ```bash
   export UPSTASH_VECTOR_REST_URL="your-url"
   export UPSTASH_VECTOR_REST_TOKEN="your-token"
   ```

**Note:** This is completely optional! Context7 MCP works great without any API keys using the official Upstash implementation.

### When to Use grep.app

Use grep.app to search for real-world examples when:
- Learning how to implement Datastar directives and patterns
- Finding BasecoatCSS component implementations
- Looking for Hono middleware or routing patterns
- Searching for specific API usage patterns

**Example prompts:**
```
"Use grep.app to find examples of data-on-click usage in Datastar applications"
"Search for BasecoatCSS button component implementations with hover states"
"Find examples of Hono JSX components with form handling"
```

### When to Use context7

Use context7 to access detailed documentation when:
- Understanding Datastar's reactivity system and core concepts
- Learning about BasecoatCSS utility classes and design system
- Looking up Hono API references and middleware options
- Understanding Bknd configuration and features

**Example prompts:**
```
"Use context7 to explain Datastar's data-store directive and state management"
"Look up BasecoatCSS spacing utilities and responsive design patterns"
"Find Hono's documentation on JSX components and props handling"
```

## WORKING WITH DATASTAR

Datastar is a hypermedia-driven framework for building interactive UIs. When working with Datastar:

### Key Concepts
- **Signals**: Use `data-store` to define reactive state
- **Actions**: Use `data-on-*` for event handling
- **Effects**: Use `data-text`, `data-show`, etc. for reactive updates
- **Server-Sent Events**: Use `data-on-load` with SSE endpoints

### Good Prompts for Datastar Work

```
"Create a todo list component using Datastar with add/remove/toggle functionality"
"Implement a form with Datastar that validates on blur and submits with data-on-submit"
"Build a reactive counter with Datastar signals that persists to localStorage"
"Use grep.app to find examples of Datastar infinite scroll implementations"
```

### Common Patterns

**Component with Local State:**
```tsx
<div data-store="{ count: 0 }">
  <button data-on-click="count++">Increment</button>
  <span data-text="count"></span>
</div>
```

**Server-Side Events:**
```tsx
<div data-on-load="sse:/api/updates">
  <div data-text="message"></div>
</div>
```

## WORKING WITH BASECOATCSS

BasecoatCSS is a utility-first CSS framework with semantic component classes. When working with BasecoatCSS:

### Key Concepts
- **Utility Classes**: Use for spacing, typography, colors (e.g., `p-4`, `text-lg`, `bg-primary`)
- **Component Classes**: Pre-built components like `.button`, `.card`, `.form-group`
- **Responsive Design**: Mobile-first with breakpoint prefixes (e.g., `sm:`, `md:`, `lg:`)
- **Custom Properties**: CSS variables for theming

### Good Prompts for BasecoatCSS Work

```
"Create a responsive navigation bar using BasecoatCSS component classes"
"Build a form layout with BasecoatCSS form-group and input utilities"
"Design a card grid using BasecoatCSS grid utilities and card components"
"Use grep.app to find examples of BasecoatCSS modal implementations"
```

### Common Patterns

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

When building components that combine both:

### Interactive Components
```tsx
<div class="card p-4" data-store="{ isOpen: false }">
  <button 
    class="button button-primary"
    data-on-click="isOpen = !isOpen"
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

### Form with Validation
```tsx
<form class="form" data-store="{ email: '', error: '' }">
  <div class="form-group">
    <label class="form-label">Email</label>
    <input 
      type="email"
      class="form-input"
      data-model="email"
    />
    <span class="text-error" data-text="error" data-show="error"></span>
  </div>
  <button class="button button-primary" type="submit">
    Submit
  </button>
</form>
```

## ADDITIONAL CONTEXT

When needing additional context, use web search, context7 MCP, or grep.app MCP tool calls to dig deeper. 

- [Hono](https://hono.dev/llms.txt)
- [BasecoatCSS](https://basecoatui.com/llms.txt)
- [BasecoatCSS Kitchen Sink of Components](https://basecoatui.com/kitchen-sink/)
- [Datastar](https://data-star.dev/docs)
- [Bknd](https://docs.bknd.io/llms-full.txt)
- [Context7 Official Site](https://context7.com)
- [Context7 GitHub Repository](https://github.com/upstash/context7)

## TIPS FOR AI ASSISTANTS

1. **Always check existing patterns first**: Use grep.app to see how similar features are implemented
2. **Refer to official docs**: Use context7 to understand the "why" behind patterns
3. **Keep it simple**: Follow the "no complex abstractions" principle
4. **Be specific**: When searching, use specific framework directives and component names
5. **Combine tools**: Use grep.app for implementation examples and context7 for conceptual understanding
6. **Trust the official implementation**: Context7 uses the official @upstash/context7-mcp package for maximum compatibility
