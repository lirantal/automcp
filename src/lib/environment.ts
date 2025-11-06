import { existsSync } from 'node:fs'
import { join } from 'node:path'

export interface AgentConfig {
  name: string
  configPath: string
}

/**
 * Detect the coding agent and locate its MCP config file.
 * Uses simple heuristics based on directory presence and file patterns.
 *
 * Priority:
 * 1. Explicit --agent and --config overrides
 * 2. .cursor directory → Cursor
 * 3. .vscode directory → VS Code
 * 4. Fallback to home directory config paths
 */
export function detectEnvironment (
  cwd: string,
  agentOverride?: string,
  configOverride?: string
): AgentConfig | null {
  // If both are provided, just return them
  if (agentOverride && configOverride) {
    return { name: agentOverride, configPath: configOverride }
  }

  // If config is provided without agent, infer agent from path
  if (configOverride) {
    const name = inferAgentFromPath(configOverride)
    return { name, configPath: configOverride }
  }

  // If agent is provided, resolve its config path
  if (agentOverride) {
    const configPath = resolveConfigPath(agentOverride, cwd)
    if (configPath) {
      return { name: agentOverride, configPath }
    }
    throw new Error(`Could not locate MCP config for agent: ${agentOverride}`)
  }

  // Auto-detect based on cwd - only check local project configs
  if (existsSync(join(cwd, '.cursor'))) {
    const configPath = resolveConfigPath('cursor', cwd)
    if (configPath) return { name: 'cursor', configPath }
  }

  if (existsSync(join(cwd, '.vscode'))) {
    const configPath = resolveConfigPath('vscode', cwd)
    if (configPath) return { name: 'vscode', configPath }
  }

  // No local agent config found - don't update global configs
  return null
}

function inferAgentFromPath (path: string): string {
  if (path.includes('cursor')) return 'cursor'
  if (path.includes('vscode') || path.includes('Code')) return 'vscode'
  if (path.includes('claude')) return 'claude-desktop'
  return 'unknown'
}

function resolveConfigPath (agent: string, cwd: string): string | null {
  // Only check local project config paths - don't update global configs
  const paths: Record<string, string[]> = {
    cursor: [
      join(cwd, '.cursor', 'mcp.json'),
    ],
    vscode: [
      join(cwd, '.vscode', 'mcp.json'),
    ],
    'claude-desktop': [], // Claude Desktop doesn't have local project configs
  }

  const candidates = paths[agent] || []
  for (const path of candidates) {
    if (existsSync(path)) return path
  }

  // Return first candidate even if it doesn't exist (we can create it later)
  return candidates[0] ?? null
}
