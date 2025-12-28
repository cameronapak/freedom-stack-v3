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

### Automatic MCP Configuration 🎉

This repository includes **automatic MCP (Model Context Protocol) configurations** for both **Cursor** and **OpenCode**! When you open this repo in either editor, the MCP servers will be automatically configured and ready to use.

**No manual setup required** - just add your API key and you're ready to go!

### Quick Setup

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your Context7 API key to `.env`:**
   - Get your API key from [https://context7.com/dashboard](https://context7.com/dashboard)
   - Add it to the `.env` file:
     ```
     CONTEXT7APIKEY=your_actual_api_key_here
     ```

3. **Restart your editor** (if it was already open)

That's it! The MCP tools will now be available automatically.

### Available MCP Tools

This repository is configured with the following MCP servers:

1. **context7** - Access comprehensive documentation for frameworks and libraries
2. **gh-grep** (grep.app) - Search across GitHub repositories for code examples

### How It Works

- **Cursor**: Reads `.cursor/mcp.json` automatically when you open the repo
- **OpenCode**: Reads `.opencode/opencode.json` automatically when you open the repo

Both configurations use the same `.env` file for API keys, ensuring a consistent experience across editors.

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

## TIPS FOR AI ASSISTANTS

1. **Always check existing patterns first**: Use grep.app to see how similar features are implemented
2. **Refer to official docs**: Use context7 to understand the "why" behind patterns
3. **Keep it simple**: Follow the "no complex abstractions" principle
4. **Be specific**: When searching, use specific framework directives and component names
5. **Combine tools**: Use grep.app for implementation examples and context7 for conceptual understanding
