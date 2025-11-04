# Contributing

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to this project.
These are mostly guidelines, not rules. Use your best judgment, and feel free
to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by a
[Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to
uphold this code.

## How to contribute to this project

### Development Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/lirantal/automcp.git
   cd automcp
   npm install
   ```

2. **Run in development**
   ```bash
   npm run start -- --dry-run
   ```

3. **Run tests**
   ```bash
   npm test
   npm run test:watch  # Watch mode
   ```

4. **Build**
   ```bash
   npm run build
   ```

5. **Lint**
   ```bash
   npm run lint
   npm run lint:fix  # Auto-fix issues
   ```

### Project Structure

```
src/
├── bin/cli.ts              # CLI entry point
├── main.ts                 # Top-level API
└── lib/
    ├── args.ts             # Argument parser
    ├── environment.ts      # Agent detection
    ├── manifest.ts         # package.json reading
    ├── npm-repo-resolver.ts # GitHub repo resolution
    ├── gitmcp.ts           # GitMCP server construction
    ├── mcp-config.ts       # MCP config management
    ├── logger.ts           # Logging utilities
    └── types.ts            # Shared TypeScript types

__tests__/
├── app.test.ts             # End-to-end tests
├── manifest.test.ts
├── npm-repo-resolver.test.ts
├── gitmcp.test.ts
└── mcp-config.test.ts
```

### Adding New Features

1. **Write tests first** — Test-driven development is encouraged
2. **Update types** — Add to `src/lib/types.ts` if needed
3. **Document** — Update README.md with new options/behavior
4. **No external deps** — Use Node.js built-ins only (runtime)
5. **Coverage** — Aim for 80%+ test coverage on new code

### Common Tasks

**Add a new CLI flag:**
1. Update `CliOptions` interface in `src/lib/types.ts`
2. Add parsing logic in `src/lib/args.ts`
3. Update help text in `src/bin/cli.ts`
4. Document in README.md

**Add a new agent:**
1. Add detection logic in `src/lib/environment.ts`
2. Add config path patterns
3. Add tests
4. Document in README.md

**Fix a bug:**
1. Write a failing test that reproduces the bug
2. Fix the bug
3. Ensure the test passes
4. Add to CHANGELOG (via changeset if applicable)

### Tests

Make sure the code you're adding has decent test coverage.

Running project tests and coverage:

```bash
npm run test
```

### Commit Guidelines

The project uses the commitizen tool for standardizing changelog style commit
and a git pre-commit hook to enforce them.
