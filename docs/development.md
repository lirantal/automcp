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

## Package-manager pin

Run `bash .github/scripts/setup-npm.sh` from the repository to install the exact
npm version in `package.json#packageManager`, then install dependencies using
the existing project setup instructions. CI uses the same setup script.

Upgrade the pin and matching lockfile metadata together in a maintenance PR.
Choose a release at least 30 days old and run the project checks with it.
Keep `.npmrc` and `pnpm-workspace.yaml` security policies enabled.
Periodic upgrade automation is not configured.
