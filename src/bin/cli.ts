#!/usr/bin/env node
import pkg from '../../package.json' with { type: 'json' }
import { parseArgs } from '../lib/args.ts'
import { createLogger } from '../lib/logger.ts'
import { runAutomcp } from '../main.ts'

async function main () {
  const options = parseArgs(process.argv.slice(2))
  const log = createLogger({ silent: options.silent, json: options.json })

  if (options.version) {
    // Print version and exit
    process.stdout.write(`${pkg.version}\n`)
    return
  }

  if (options.help) {
    const header = 'automcp — automatically add GitMCP servers\n'
    const usage = '\nUsage:\n  npx automcp [options]\n\nOptions:\n  --dry-run            Show planned changes without writing\n  --agent <name>       Override detected agent (e.g., cursor, vscode)\n  --config <path>      Override MCP config file path\n  --include-dev        Include devDependencies (default: false)\n  --silent             Minimal output\n  --json               JSON summary output\n  -h, --help           Show help\n  -v, --version        Show version\n'
    process.stdout.write(header + usage)
    return
  }

  try {
    const result = await runAutomcp(options)
    if (options.json) {
      process.stdout.write(JSON.stringify({ ok: true, result }) + '\n')
    } else {
      // Header with agent and config info
      log.info(`\n🔍 Agent: ${result.agentName}`)
      log.info(`📝 Config: ${result.configPath}`)
      if (result.dryRun) {
        log.info('🧪 Dry-run mode: no files will be modified\n')
      } else {
        log.info('')
      }

      // Added servers
      if (result.added > 0) {
        log.success(`✅ Added ${result.added} MCP server${result.added === 1 ? '' : 's'}:\n`)
        for (const server of result.addedServers) {
          log.info(`   • ${server.name}`)
          log.info(`     ${server.url}\n`)
        }
      }

      // Skipped servers
      if (result.skipped > 0) {
        log.info(`⏭️  Skipped ${result.skipped} duplicate${result.skipped === 1 ? '' : 's'}:\n`)
        for (const server of result.skippedServers) {
          log.info(`   • ${server.name}`)
          log.info(`     ${server.url}\n`)
        }
      }

      // Errors
      if (result.errors > 0) {
        log.warn(`⚠️  Encountered ${result.errors} package${result.errors === 1 ? '' : 's'} without GitHub repos\n`)
      }

      // Summary
      if (result.added === 0 && result.skipped === 0) {
        log.info('ℹ️  No changes needed.\n')
      } else if (result.dryRun && result.added > 0) {
        log.info('💡 Run without --dry-run to apply these changes.\n')
      } else if (result.added > 0) {
        log.success('✨ MCP config updated successfully!\n')
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    log.error(`Fatal error: ${message}`)
    process.exitCode = 1
  }
}

main()
