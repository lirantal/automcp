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

Options

- --dry-run: Show planned changes without writing
- --agent <name>: Override detected agent (e.g., cursor, vscode)
- --config <path>: Override MCP config file path
- --include-dev: Include devDependencies (default: false)
- --silent: Minimal output
- --json: JSON summary output
- -h, --help: Show help
- -v, --version: Show version

Examples

```sh
# Preview changes only
npx automcp --dry-run

# Explicitly target Cursor and a custom config path
npx automcp --agent cursor --config ~/.cursor/mcp.json
```

## Contributing

Please consult [CONTRIBUTING](./.github/CONTRIBUTING.md) for guidelines on contributing to this project.

## Author

**automcp** © [Liran Tal](https://github.com/lirantal), Released under the [Apache-2.0](./LICENSE) License.