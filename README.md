<!-- markdownlint-disable -->

<p align="center"><h1 align="center">
  automcp
</h1>

<p align="center">
  AutoMCP detects your package manifest file and automatically adds relevant MCP (Model Context Protocol) servers to the coding agents it detects
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/automcp"><img src="https://badgen.net/npm/v/automcp" alt="npm version"/></a>
  <a href="https://www.npmjs.org/package/automcp"><img src="https://badgen.net/npm/license/automcp" alt="license"/></a>
  <a href="https://www.npmjs.org/package/automcp"><img src="https://badgen.net/npm/dt/automcp" alt="downloads"/></a>
  <a href="https://github.com/lirantal/automcp/actions?workflow=CI"><img src="https://github.com/lirantal/automcp/workflows/CI/badge.svg" alt="build"/></a>
  <a href="https://codecov.io/gh/lirantal/automcp"><img src="https://badgen.net/codecov/c/github/lirantal/automcp" alt="codecov"/></a>
  <a href="https://snyk.io/test/github/lirantal/automcp"><img src="https://snyk.io/test/github/lirantal/automcp/badge.svg" alt="Known Vulnerabilities"/></a>
  <a href="./SECURITY.md"><img src="https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg" alt="Responsible Disclosure Policy" /></a>
</p>

## Features

- 🔍 **Auto-detects** your coding agent (Cursor, VS Code, Claude Desktop)
- 📦 **Scans** your project dependencies from package.json
- 🔗 **Resolves** each package to its GitHub repository
- 🌐 **Generates** GitMCP server URLs automatically
- ✅ **Never overwrites** existing MCP server configurations
- 🚫 **Prevents duplicates** via smart URL normalization
- 🏃 **Fast** concurrent resolution with connection pooling
- 🧪 **Dry-run mode** to preview changes safely
- 🎯 **Zero runtime dependencies** — uses only Node.js built-ins

## Install

You can run `automcp` with npx (no install required) or add it to your project.

```sh
npx automcp
# or
npm add -D automcp
```

## Usage: CLI

```sh
npx automcp [options]
```

### Options

- `--dry-run`: Show planned changes without writing
- `--agent <name>`: Override detected agent (e.g., cursor, vscode)
- `--config <path>`: Override MCP config file path
- `--include-dev`: Include devDependencies (default: false)
- `--silent`: Minimal output
- `--json`: JSON summary output
- `-h`, `--help`: Show help
- `-v`, `--version`: Show version

### Examples

```sh
# Preview changes only
npx automcp --dry-run

# Explicitly target Cursor and a custom config path
npx automcp --agent cursor --config ~/.cursor/mcp.json

# Include devDependencies
npx automcp --include-dev

# JSON output for CI/automation
npx automcp --json
```

### How It Works

1. **Detects your coding agent** (Cursor, VS Code) and locates its MCP config file
2. **Reads your package.json** dependencies
3. **Resolves each dependency** to its GitHub repository via `npm view`
4. **Builds GitMCP URLs** in the format `https://gitmcp.io/owner/repo`
5. **Updates your MCP config** without overwriting existing entries or creating duplicates

## Quick Start

```sh
# Run in your project directory
cd my-project
npx automcp

# Preview changes first
npx automcp --dry-run

# Include devDependencies
npx automcp --include-dev
```

### Real-World Example

Given a project with these dependencies:

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21",
    "axios": "^1.6.0"
  }
}
```

Running `npx automcp` will:

1. Detect your agent (e.g., Cursor at `~/.cursor/mcp.json`)
2. Resolve GitHub repos:
   - express → expressjs/express
   - lodash → lodash/lodash
   - axios → axios/axios
3. Add to your MCP config:

```json
{
  "mcpServers": {
    "express Docs": {
      "url": "https://gitmcp.io/expressjs/express"
    },
    "lodash Docs": {
      "url": "https://gitmcp.io/lodash/lodash"
    },
    "axios Docs": {
      "url": "https://gitmcp.io/axios/axios"
    }
  }
}
```

### Supported Agents

- **Cursor** — `.cursor/mcp.json` or `~/.cursor/mcp.json`
- **VS Code** — `.vscode/mcp.json` or `~/.vscode/mcp.json`
- **Claude Desktop** — `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)

Use `--agent` and `--config` flags to override auto-detection.

### Troubleshooting

**Agent not detected**
```sh
npx automcp --agent cursor --config ~/.cursor/mcp.json
```

**Permission errors**
Ensure you have write access to the MCP config directory.

**Non-GitHub packages skipped**
Only packages with GitHub repositories are supported. Packages without a `repository` field or with non-GitHub URLs will be skipped.

**URL resolution timeouts**
The CLI runs `npm view` with a 10-second timeout per package. Slow network or large dependency lists may take time.

### Output Example

**Standard output:**
```
🔍 Agent: cursor
📝 Config: /Users/username/.cursor/mcp.json

✅ Added 3 MCP servers:

   • express Docs
     https://gitmcp.io/expressjs/express

   • lodash Docs
     https://gitmcp.io/lodash/lodash

   • axios Docs
     https://gitmcp.io/axios/axios

✨ MCP config updated successfully!
```

**With dry-run:**
```
🔍 Agent: cursor
📝 Config: /Users/username/.cursor/mcp.json
🧪 Dry-run mode: no files will be modified

✅ Added 5 MCP servers:

   • express Docs
     https://gitmcp.io/expressjs/express

   • lodash Docs
     https://gitmcp.io/lodash/lodash

💡 Run without --dry-run to apply these changes.
```

**With duplicates:**
```
🔍 Agent: cursor
📝 Config: /Users/username/.cursor/mcp.json

⏭️  Skipped 2 duplicates:

   • express Docs
     https://gitmcp.io/expressjs/express

   • lodash Docs
     https://gitmcp.io/lodash/lodash
```

**JSON output (for CI/automation):**
```sh
npx automcp --json
```
```json
{
  "ok": true,
  "result": {
    "added": 3,
    "skipped": 0,
    "errors": 0,
    "addedServers": [
      {
        "name": "express Docs",
        "url": "https://gitmcp.io/expressjs/express"
      }
    ],
    "skippedServers": [],
    "configPath": "/Users/username/.cursor/mcp.json",
    "agentName": "cursor",
    "dryRun": false
  }
}
```

## Node.js Compatibility

- **Requires:** Node.js >= 22.0.0
- Uses ES2022+ features and Node.js built-in APIs
- No external runtime dependencies

## CI/CD Integration

Use `--json` and `--silent` flags for automation:

```yaml
# GitHub Actions example
- name: Update MCP config
  run: |
    npx automcp --json --silent > result.json
    cat result.json
```

Exit codes:
- `0`: Success (including when nothing to add)
- `1`: Fatal error (config parse failure, permission denied, missing package.json)

## Contributing

Please consult [CONTRIBUTING](./.github/CONTRIBUTING.md) for guidelines on contributing to this project.

## Author

**automcp** © [Liran Tal](https://github.com/lirantal), Released under the [Apache-2.0](./LICENSE) License.