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
      if (result.added > 0) log.success(`Added ${result.added} MCP server${result.added === 1 ? '' : 's'}.`)
      if (result.skipped > 0) log.info(`Skipped ${result.skipped} duplicate${result.skipped === 1 ? '' : 's'}.`)
      if (result.errors > 0) log.warn(`Encountered ${result.errors} non-fatal error${result.errors === 1 ? '' : 's'}.`)
      if (result.added === 0 && result.skipped === 0) log.info('No changes needed.')
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    log.error(`Fatal error: ${message}`)
    process.exitCode = 1
  }
}

main()
