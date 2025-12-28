# Cursor MCP Configuration

This guide will help you set up MCP servers for enhanced AI assistance in Cursor.

## Setup Instructions

### 1. Locate Cursor Config Directory

The Cursor configuration file is located at:
- **macOS/Linux**: `~/.cursor/config.json`
- **Windows**: `%APPDATA%\Cursor\config.json`

### 2. Add MCP Server Configuration

Add the following to your `config.json` file under the `mcpServers` key:

```json
{
  "mcpServers": {
    "grep-app": {
      "command": "npx",
      "args": [
        "-y",
        "@grepapp/mcp-server-grep-app"
      ],
      "env": {
        "GREP_APP_API_KEY": "YOUR_GREP_APP_API_KEY_HERE"
      }
    },
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@context7/mcp-server"
      ],
      "env": {
        "CONTEXT7_API_KEY": "YOUR_CONTEXT7_API_KEY_HERE"
      }
    }
  }
}
```

### 3. Get API Keys

#### grep.app API Key
1. Visit [grep.app](https://grep.app)
2. Sign up or log in
3. Navigate to API settings
4. Generate an API key
5. Replace `YOUR_GREP_APP_API_KEY_HERE` in the config

#### Context7 API Key
1. Visit [context7.io](https://context7.io)
2. Sign up or log in
3. Generate an API key from your dashboard
4. Replace `YOUR_CONTEXT7_API_KEY_HERE` in the config

### 4. Restart Cursor

After adding the configuration, restart Cursor for the changes to take effect.

## Using the MCP Servers

Once configured, the AI assistant in Cursor will automatically have access to:
- **grep.app**: Search across millions of public GitHub repositories for code examples and patterns
- **context7**: Access comprehensive documentation and context for libraries and frameworks

## Verification

To verify the setup is working:
1. Open Cursor
2. Start a chat with the AI
3. Ask it to search for specific code patterns using grep.app or look up documentation using context7
4. The AI should be able to use these tools automatically

## Troubleshooting

- **MCP servers not working**: Check that your API keys are correctly set
- **npx command not found**: Ensure Node.js and npm are installed
- **Permission errors**: Check file permissions on the config.json file
