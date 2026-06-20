# Architecture

## Overview

automcp package description: AutoMCP detects your package manifest file and automatically adds relevant MCP (Model Context Protocol) servers to the coding agents it detects.

## Repository Structure

- `package.json` - root package scripts and dependency metadata.
- `.changeset/` - Changesets configuration and pending release notes.
- `docs/` - project documentation for maintainers and coding agents.

## Boundaries

- Keep user-facing usage, installation, and examples in the root `README.md`.
- Keep contribution rules in `CONTRIBUTING.md`.
- Keep release workflow details in `RELEASE.md`.
- Keep deeper development and architecture notes in `docs/`.
