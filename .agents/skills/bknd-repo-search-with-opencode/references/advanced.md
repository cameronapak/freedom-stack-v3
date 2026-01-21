# Advanced btca Usage

## Multi-Resource Queries

### Adding Related Resources
```bash
# Add Next.js for integration questions
btca config resources add --name nextjs --type git --url https://github.com/vercel/next.js --branch canary

# Add React for component patterns
btca config resources add --name react --type git --url https://github.com/facebook/react --branch main

# Add Drizzle ORM for database patterns
btca config resources add --name drizzle --type git --url https://github.com/drizzle-team/drizzle-orm --branch main
```

### Query Multiple Resources
```bash
# Compare bknd and Next.js patterns
btca ask --resource bknd --resource nextjs --question "How do I integrate bknd with Next.js?"

# Understand relationships
btca ask --resource bknd --resource drizzle --question "How does bknd's query system compare to Drizzle?"

# Three-way queries
btca ask --resource bknd --resource nextjs --resource react --question "How do I use bknd in React Server Components?"
```

### Multi-Resource Config Example
```jsonc
{
  "$schema": "https://btca.dev/btca.schema.json",
  "model": "big-pickle",
  "provider": "opencode",
  "resources": [
    {
      "name": "bknd",
      "type": "git",
      "url": "https://github.com/bknd-io/bknd",
      "branch": "main"
    },
    {
      "name": "nextjs",
      "type": "git",
      "url": "https://github.com/vercel/next.js",
      "branch": "canary",
      "searchPath": "packages/next/src"
    },
    {
      "name": "drizzle",
      "type": "git",
      "url": "https://github.com/drizzle-team/drizzle-orm",
      "branch": "main"
    }
  ]
}
```

## Interactive Workflows

### Deep Dive Sessions
Start `btca chat` for focused learning on specific topics:

```bash
# Start chat mode
btca chat --resource bknd

# Example session flow:
# > Explain the data module architecture
# > How do I create a schema?
# > Show me an example of querying data
# > What about filtering?
# > How do I handle relations?
# > What are the performance considerations?
```

### Problem-Solving Flow
```bash
# Start chat mode
btca chat --resource bknd

# Example session:
# > I need to implement file uploads
# > How do I set up the media module?
# > What storage options work best for S3?
# > How do I secure the upload endpoint?
# > Show me a complete example
```

### Learning a New Module
```bash
# Systematic exploration
btca chat --resource bknd

# > What is the flows module?
# > When would I use it?
# > Show me a simple example
# > How does it integrate with the data module?
# > What are the limitations?
# > Where can I find more complex examples?
```

## Performance Optimization

### Faster Models
```bash
# Switch to faster model for quick queries
btca config model --provider opencode --model big-pickle
```

### Reduce Search Scope
Focus on relevant directories to speed up queries:

```jsonc
{
  "resources": [
    {
      "name": "bknd",
      "type": "git",
      "url": "https://github.com/bknd-io/bknd",
      "branch": "main",
      "searchPaths": ["src/data", "src/auth"]
    }
  ]
}
```

### Clear Cache
Force fresh clone if you suspect stale data:

```bash
btca clear
```

## Server Mode

Run btca as an HTTP server for programmatic access:

```bash
btca serve --port 3000
```

This enables API access for integrating btca into tools or other applications.

## Debugging Techniques

### Understanding Errors
```bash
# Get context on specific error messages
btca ask --resource bknd --question "What causes the 'connection failed' error in bknd?"

# Find error handling patterns
btca ask --resource bknd --question "How does bknd handle database connection errors?"
```

### Finding Similar Patterns
```bash
# See how other features are implemented
btca ask --resource bknd --question "Show me other examples of auth configuration"

# Compare implementations
btca ask --resource bknd --question "How does the PostgreSQL adapter differ from the MySQL adapter?"
```

### Tracing Code Flow
```bash
# Follow the execution path
btca ask --resource bknd --question "How does src/App.ts initialize the modules?"

# Understand data flow
btca ask --resource bknd --question "How does a query flow from the API to the database?"
```

## Advanced Configuration

### Special Notes for AI
Provide detailed hints to improve query results:

```jsonc
{
  "resources": [
    {
      "name": "bknd",
      "type": "git",
      "url": "https://github.com/bknd-io/bknd",
      "branch": "main",
      "specialNotes": "Backend framework with modular architecture. Key files:\n- src/App.ts: Main entry point, initializes modules\n- src/data/schema.ts: Schema definitions\n- src/data/query.ts: Query builder implementation\n- src/auth/strategies/: Auth strategies\n- examples/nextjs: Next.js integration examples\nFocus on TypeScript types and patterns rather than implementation details."
    }
  ]
}
```

### Multiple Search Paths
Target specific directories:

```jsonc
{
  "resources": [
    {
      "name": "bknd",
      "type": "git",
      "url": "https://github.com/bknd-io/bknd",
      "branch": "main",
      "searchPaths": [
        "src/data",
        "src/auth",
        "examples/nextjs",
        "src/media"
      ]
    }
  ]
}
```

## Best Practices

### Effective Querying

1. **Start broad, then narrow**
   ```bash
   # First: Understand the feature
   btca ask --resource bknd --question "How does the flows module work?"

   # Then: Get specific details
   btca ask --resource bknd --question "How do I configure flow timeouts?"
   ```

2. **Reference specific files**
   ```bash
   btca ask --resource bknd --question "How does src/data/query.ts implement filtering?"
   ```

3. **Ask for examples**
   ```bash
   btca ask --resource bknd --question "Show me a complete example of setting up S3 storage"
   ```

4. **Compare implementations**
   ```bash
   btca ask --resource bknd --resource drizzle --question "Compare bknd's query syntax to Drizzle's"
   ```

### When to Use Interactive Chat vs. Single Questions

**Use `btca ask` for:**
- Quick, specific questions
- One-time lookups
- API references
- Simple examples

**Use `btca chat` for:**
- Learning a new feature in depth
- Exploring a topic systematically
- Problem-solving sessions
- Multi-step workflows
- Comparing multiple approaches

## Resource Management Strategies

### Project-Specific vs. Global Config

**Global config** (`~/.config/btca/btca.config.jsonc`):
- Common resources used across projects
- General-purpose libraries (React, TypeScript, etc.)
- Default model preferences

**Project config** (`./btca.config.jsonc`):
- Project-specific dependencies
- Framework versions matching your project
- Domain-specific resources

### Resource Naming Conventions

Use clear, consistent names:
- `bknd` - The backend framework
- `nextjs` - Next.js framework
- `drizzle` - Drizzle ORM
- `tailwindcss` - Tailwind CSS

Avoid:
- `framework` (too vague)
- `repo1`, `repo2` (not descriptive)
- Long names with special characters

## Integrating btca into Workflow

### AGENTS.md Integration

Add to your project's `AGENTS.md`:

```markdown
## btca

Use btca to query source repositories for up-to-date information.

**Available resources**: bknd, nextjs, drizzle

### Usage

```bash
btca ask --resource <resource> --question "<question>"
```

Multiple resources:
```bash
btca ask --resource bknd --resource nextjs --question "<question>"
```

Interactive mode:
```bash
btca chat --resource <resource>
```
```

### Cursor Rule Setup

If using Cursor:

```bash
mkdir -p .cursor/rules && curl -fsSL "https://btca.dev/rule" -o .cursor/rules/better_context.mdc
```

## Troubleshooting Advanced Issues

### Inconsistent Results
```bash
# Clear cache and re-clone
btca clear

# Verify resource configuration
btca config resources list

# Test with simple query
btca ask --resource bknd --question "What is bknd?"
```

### Timeout Issues
```bash
# Increase timeout in config
{
  "providerTimeoutMs": 600000
}

# Or switch to faster model
btca config model --provider opencode --model big-pickle
```

### Missing Context
```bash
# Add searchPaths to focus on relevant files
# Add specialNotes with key file locations
# Be more specific in questions
```

## Tips for Power Users

1. **Keep resources updated**: Run `btca clear` periodically to fetch latest changes
2. **Use searchPaths wisely**: Focus queries to speed up responses
3. **Provide context**: Mention your runtime (Node, Cloudflare, etc.) in queries
4. **Ask for patterns**: "Show me examples of X" often more helpful than "How do I do X"
5. **Compare resources**: Use multi-resource queries to understand trade-offs
6. **Reference files**: Point to specific files for implementation details
7. **Use chat for learning**: Systematic exploration works best in interactive mode
8. **Document patterns**: Save good queries for future reference
