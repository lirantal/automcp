# ESLint 10 Upgrade and Migration Plan

This repository migrated its lint toolchain from ESLint 9 + `neostandard` to ESLint 10 with explicit flat-config dependencies.

## What changed

1. Replaced `neostandard` with:
   - `@eslint/js`
   - `typescript-eslint`
   - `eslint-plugin-n`
   - `eslint-plugin-security`
2. Switched `eslint.config.js` to `defineConfig()` and `globalIgnores()`.
3. Removed `lockfile-lint` and the `lint:lockfile` script from npm scripts.
4. Updated lint-related dependencies (including `eslint`, `c8`, and Changesets packages).
5. Preserved original caught errors with `Error` `cause` where errors are rethrown from `catch` blocks.

## Migration guidance for contributors

1. Install dependencies with `npm ci`.
2. Run validation in this order:
   - `npm run lint`
   - `npm run build`
   - `npm test`
3. If adding new lint rules or plugins, update `eslint.config.js` directly (no `neostandard` wrapper exists anymore).
4. If rethrowing errors from `catch` blocks, preserve the original error using `cause`.

## Why this migration

- Aligns linting with modern ESLint 10 flat-config patterns.
- Reduces indirection by using explicit lint dependencies and direct configuration.
- Improves debugging by retaining original exception causes.
