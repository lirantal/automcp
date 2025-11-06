import type { AutomcpResult, CliOptions } from './lib/types.ts'
import { detectEnvironment } from './lib/environment.ts'
import { readPackageManifest, extractDependencies } from './lib/manifest.ts'
import { resolveMultiple } from './lib/npm-repo-resolver.ts'
import { buildGitMcpServers } from './lib/gitmcp.ts'
import { updateMcpConfig } from './lib/mcp-config.ts'

export async function runAutomcp (options: CliOptions): Promise<AutomcpResult> {
  const cwd = process.cwd()

  // 1. Detect agent and config path
  const agentConfig = detectEnvironment(cwd, options.agent, options.config)
  if (!agentConfig) {
    throw new Error(
      'NO_LOCAL_CONFIG:Could not detect a local coding agent configuration. Use --agent and --config to specify manually.'
    )
  }

  // 2. Read package.json and extract dependencies
  const pkg = await readPackageManifest(cwd)
  const dependencies = extractDependencies(pkg, options.includeDev)

  if (dependencies.length === 0) {
    return {
      added: 0,
      skipped: 0,
      errors: 0,
      addedServers: [],
      skippedServers: [],
      configPath: agentConfig.configPath,
      agentName: agentConfig.name,
      dryRun: options.dryRun,
    }
  }

  // 3. Resolve GitHub repos for each dependency
  const repoMap = await resolveMultiple(dependencies, 5)

  // Count errors (packages that couldn't be resolved)
  let errors = 0
  for (const [, repo] of repoMap) {
    if (repo === null) errors += 1
  }

  // 4. Build GitMCP server entries
  const servers = buildGitMcpServers(repoMap)

  if (servers.length === 0) {
    return {
      added: 0,
      skipped: 0,
      errors,
      addedServers: [],
      skippedServers: [],
      configPath: agentConfig.configPath,
      agentName: agentConfig.name,
      dryRun: options.dryRun,
    }
  }

  // 5. Update MCP config
  const result = await updateMcpConfig(agentConfig.configPath, servers, options.dryRun)

  return {
    added: result.added.length,
    skipped: result.skipped.length,
    errors,
    addedServers: result.added,
    skippedServers: result.skipped,
    configPath: agentConfig.configPath,
    agentName: agentConfig.name,
    dryRun: options.dryRun,
  }
}
