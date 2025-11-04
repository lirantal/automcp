# automcp Roadmap

This document tracks the implementation plan, milestones, and acceptance criteria for the `automcp` CLI.

## Goals

- CLI that detects the coding agent (e.g., Cursor, VS Code) and finds its MCP config.
- Reads project `package.json` dependencies and resolves each to a GitHub `owner/repo`.
- Constructs GitMCP server URLs: `https://gitmcp.io/<owner>/<repo>`.
- Adds servers to the agent's MCP config without overwriting existing settings or adding duplicates.
- Clear, informative output; graceful error handling.

## Milestones

### M1 — CLI skeleton and manifest reader ✅
- [x] Define CLI options: `--dry-run`, `--agent`, `--config`, `--include-dev`, `--silent`, `--json`.
- [x] Implement logging using built-in console (no external chalk).
- [x] Implement reading and validating presence of `package.json`.
- [x] Extract dependency names (default: dependencies only).

### M2 — Repository resolution ✅
- [x] For each dependency, run `npm view <pkg> repository.url` via `child_process`.
- [x] Normalize GitHub URLs (handle `git+https` and `https`).
- [x] Fallback to local manifest `repository`/`homepage` if needed.
- [x] Skip non-GitHub repos with a warning; continue.

### M3 — Agent detection and MCP config merge ✅
- [x] Use built-in heuristics to detect agent and resolve MCP config file path.
- [x] Parse JSON/JSONC using custom comment stripper (string-aware).
- [x] Ensure schema `{ mcpServers: { [name]: { url } } }` exists.
- [x] Deduplicate by URL (normalize trailing slashes / case), avoid overwriting other entries.
- [x] Atomic write; create file if missing; support `--dry-run`.

### M4 — Orchestration, UX, and tests ✅
- [x] Orchestrate end-to-end flow with clear messages and exit codes.
- [x] Add unit tests for resolver and config manager; integration tests using temp dirs.
- [x] Implemented proper JSONC comment stripping that doesn't break URLs.

### M5 — Docs and polish
- [ ] README: quickstart, options, supported agents, troubleshooting.
- [ ] Example output; `--json` machine output format.
- [ ] CI notes; confirm Node.js engine compatibility.

## Dependencies

Runtime (opted out):
- ~~`agent-files`~~ — Built custom detection instead
- ~~`jsonc-parser`~~ — Built custom comment stripper instead
- ~~`fs-extra`~~ — Used Node.js built-in `fs/promises`

Built-ins only:
- `node:child_process` (for `npm view`)
- `node:fs` and `node:fs/promises`
- `node:path`, `node:os`, `node:util`

No external runtime dependencies.

## Acceptance Criteria (from project plan)

- Should not overwrite existing MCP server configurations—only add new ones.
- Should not create duplicate server entries.
- Should provide informative console output showing additions and skips.
- Should handle errors gracefully (missing repo URL, unreachable services, etc.).

## Tracking and Workflow

- Convert each milestone into one or more GitHub Issues; assign the `milestone` accordingly.
- Use a lightweight Project board (To do / In progress / Done) for visibility.
- Keep this ROADMAP updated in PRs (check items as they land).
- Use PR templates with a checklist referencing items above.
- Use Changesets for versioning and release notes (already configured).

## Done Definition

- All acceptance criteria met.
- Unit and integration tests pass on CI.
- `npx automcp` works in a sample project for Cursor/VS Code.
- README and ROADMAP are up to date.