import type { CliOptions } from './types.ts'

function readArgValue (args: string[], index: number): { value?: string, nextIndex: number } {
  const current = args[index] ?? ''
  const eq = current.indexOf('=')
  if (eq !== -1) {
    return { value: current.slice(eq + 1), nextIndex: index + 1 }
  }
  const next = args[index + 1]
  if (index + 1 < args.length && next && !next.startsWith('-')) {
    return { value: next, nextIndex: index + 2 }
  }
  return { nextIndex: index + 1 }
}

export function parseArgs (argv: string[]): CliOptions {
  let i = 0
  const opts: CliOptions = {
    dryRun: false,
    includeDev: false,
    silent: false,
    json: false,
    help: false,
    version: false,
  }
  const flagHandlers = new Map<string, () => void>([
    ['--dry-run', () => { opts.dryRun = true }],
    ['--include-dev', () => { opts.includeDev = true }],
    ['--silent', () => { opts.silent = true }],
    ['--json', () => { opts.json = true }],
    ['--help', () => { opts.help = true }],
    ['-h', () => { opts.help = true }],
    ['--version', () => { opts.version = true }],
    ['-v', () => { opts.version = true }],
  ])

  while (i < argv.length) {
    const token = argv[i] as string
    if (token.startsWith('--agent')) {
      const { value, nextIndex } = readArgValue(argv, i)
      if (value) opts.agent = value
      i = nextIndex
      continue
    }
    if (token.startsWith('--config')) {
      const { value, nextIndex } = readArgValue(argv, i)
      if (value) opts.config = value
      i = nextIndex
      continue
    }
    const handler = flagHandlers.get(token)
    if (handler) {
      handler()
      i += 1
    } else {
      i += 1
    }
  }
  return opts
}
