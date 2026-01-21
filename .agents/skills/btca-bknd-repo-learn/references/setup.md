# Setup and Configuration

## Installation

```bash
bun add -g btca opencode-ai
```

Requires Bun 1.1.0+

## Model Configuration

btca uses OpenCode's SDK for AI completions. Several models are available:

### Recommended: Big Pickle
Free, fast, surprisingly good quality.

```bash
btca config model --provider opencode --model big-pickle
```

### Other Options

| Model | Provider | Description |
|-------|----------|-------------|
| `claude-haiku-4-5` | opencode | Haiku 4.5, no reasoning. Official docs "HIGHLY recommend" |
| `minimax-m2.1-free` | opencode | Very fast, very cheap, pretty good |
| `glm-4.7-free` | opencode | GLM 4.7 through opencode zen |
| `kimi-k2` | opencode | Kimi K2, no reasoning |

```bash
btca config model --provider opencode --model <model-name>
```

Note: Providers require credentials configured in OpenCode. Run `opencode auth` to connect.

## Resource Configuration

### Add via CLI

```bash
btca config resources add --name bknd --type git --url https://github.com/bknd-io/bknd --branch main
```

### Edit Config File

Create `btca.config.jsonc` in project root (or `~/.config/btca/btca.config.jsonc` for global):

```jsonc
{
  "$schema": "https://btca.dev/btca.schema.json",
  "model": "big-pickle",
  "provider": "opencode",
  "providerTimeoutMs": 300000,
  "resources": [
    {
      "type": "git",
      "name": "bknd",
      "url": "https://github.com/bknd-io/bknd",
      "branch": "main",
      "specialNotes": "Backend framework with data, auth, media, and flows modules"
    }
  ]
}
```

### Resource Fields

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | Always `"git"` |
| `name` | Yes | Short identifier used in CLI commands |
| `url` | Yes | Git repository URL |
| `branch` | Yes | Branch to clone |
| `searchPath` | No | Subdirectory to search within the repo |
| `searchPaths` | No | Multiple subdirectories to search |
| `specialNotes` | No | Hints for the AI about this resource |

### Advanced Config Options

#### Search Paths
Focus on specific parts of the repo:

```jsonc
{
  "resources": [
    {
      "name": "bknd",
      "type": "git",
      "url": "https://github.com/bknd-io/bknd",
      "branch": "main",
      "searchPaths": ["src/data", "src/auth", "examples/nextjs"]
    }
  ]
}
```

#### Special Notes
Add hints for the AI:

```jsonc
{
  "resources": [
    {
      "name": "bknd",
      "type": "git",
      "url": "https://github.com/bknd-io/bknd",
      "branch": "main",
      "specialNotes": "Backend framework. Key files: src/App.ts, src/data/schema.ts, src/auth/strategies/"
    }
  ]
}
```

## Resource Management

### List all resources
```bash
btca config resources list
```

### Remove a resource
```bash
btca config resources remove --name bknd
```

### Clear cached repositories
```bash
btca clear
```

Resources are cloned to `~/.local/share/btca/resources/` on first use.

## Troubleshooting Setup

### Resource Not Found
```bash
# Check resources list
btca config resources list

# Re-add if missing
btca config resources add --name bknd --type git --url https://github.com/bknd-io/bknd --branch main
```

### Slow Responses
```bash
# Try a faster model
btca config model --provider opencode --model big-pickle

# Reduce search scope
# Edit config to use searchPath instead of full repo
```

### Outdated Information
```bash
# Clear cache to force fresh clone
btca clear

# Run query again
btca ask --resource bknd --question "What's new in the latest version?"
```

## Getting Started Checklist

1. [ ] Install btca and opencode-ai
2. [ ] Configure OpenCode credentials (run `opencode auth`)
3. [ ] Set model preference
4. [ ] Add bknd as a resource
5. [ ] Test with a simple query
6. [ ] (Optional) Add `.btca` to `.gitignore`

### Example First Query

```bash
btca ask --resource bknd --question "What is the overall architecture of bknd?"
```
