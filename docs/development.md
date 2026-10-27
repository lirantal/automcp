# Development

## Prerequisites

- Node.js compatible with this repository's packages and tooling.
- npm for dependency installation and scripts.

## Setup

```sh
npm install
```

## Common Commands

- `pnpm build` - builds the project.
- `pnpm lint` - runs lint checks.
- `pnpm test` - runs the test suite.

## Repository Notes

This repository is organized around the root package `automcp`.

## TypeScript Compatibility

Keep TypeScript on `~6.0.3` while `typescript-eslint` requires versions below
6.1. Dependabot defers TypeScript 6.1 and newer until parser support is available.
Recheck the parser peer dependency range and validate install, lint, build,
and tests before widening both constraints.
