## High-level description for this project

- `automcp` is an npm command-line tool that automates the installation of MCP (Model Context Protocol) servers in agentic coding tools like VS Code, Cursor, etc
- `automcp` runs via npx like this `npx automcp`
- `automcp` detects the coding tool environment (e.g., VS Code, Cursor) and reads your project's package manifest file (`package.json`) to identify the packages you depend on and then sets up the appropriate MCP server for those packages
- `automcp` relies on the GitMCP HTTP service to provide the MCP servers documentation for each package

## How should `automcp` work

- A user just runs `npx automcp` in the root of their project
- `automcp` detects the coding tool environment based on files present in the current working directory. Heuristics examples would be:
  - IDE files such as `.vscode` for VS Code, or `.cursor` for Cursor
  - Agent specific rules files like `CLAUDE.md` or `GEMINI.md` for Claude or Gemini agents can help in hinting what agent is being used
  - You should use the `agent-files` npm package to help with this detection because it maps agentic coding tools to their MCP configuration files and exposes an API to find those files
- Once `automcp` detects the coding tool environment, it reads the `package.json` file in the current working directory where the `automcp` CLI is being executed, in order to identify the dependencies listed under `dependencies`
- For each dependency, `automcp` needs to get the GitHub repository URL. It can do this by:
  - Querying the npm CLI using `npm view <package-name> repository.url` which may respond with a GitHub git URL such as `git+https://github.com/expressjs/express.git` which it needs to parse to get the `expressjs/express` part
- Once `automcp` has the GitHub repository name, it constructs the GitMCP URL like this: `https://gitmcp.io/<username>/<repo>` and adds that MCP server to the coding tool's MCP configuration file

## Dependencies for `automcp`

- The `automcp` CLI will depend on an npm package that will help with finding the coding tool MCP files and parsing them. This package is called `agent-files` and `automcp` will depend on it directly.

## How GitMCP works

- GitMCP is an HTTP service at this endpoint: `https://gitmcp.io`
- GitMCP expects to receive a username and repository name like this: `gitmcp.io/username/repo` for which it will serve an MCP server dedicated to that repository, for example: `https://gitmcp.io/expressjs/express` serves the MCP server for the Express.js repository

## How to configure MCP servers in the coding agent

- MCP Servers are configured as MCP Servers with an HTTP transport
- Example for a Cursor compatible MCP configuration in `~/.cursor/mcp.json`:
```jsonc
{
  "mcpServers": {
    "express Docs": {
      "url": "https://gitmcp.io/expressjs/express"
    }
  }
}
```

## Acceptance Criteria

- `automcp` shouldn't overwrite any existing MCP server configurations in the coding tool's MCP configuration file, it should only add new ones.
- `automcp` shouldn't create duplicate MCP server entries for the same package if it is already present in the configuration file.
- `automcp` should provide informative console output indicating which MCP servers were added and any that were skipped due to already existing entries.
- `automcp` should handle errors gracefully, such as when a package's repository URL cannot be found or if the GitMCP service is unreachable.
