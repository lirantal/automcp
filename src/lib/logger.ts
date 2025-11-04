type LoggerOptions = {
  silent?: boolean
  json?: boolean
}

function out (s: string): void { process.stdout.write(s + '\n') }
function err (s: string): void { process.stderr.write(s + '\n') }

export function createLogger (opts: LoggerOptions = {}) {
  const silent = Boolean(opts.silent)
  const asJson = Boolean(opts.json)
  return {
    info: (msg: string) => { if (!silent && !asJson) out(msg) },
    warn: (msg: string) => { if (!asJson) err(`WARN: ${msg}`) },
    error: (msg: string) => { if (!asJson) err(`ERROR: ${msg}`) },
    success: (msg: string) => { if (!silent && !asJson) out(msg) },
    json: (payload: unknown) => { out(JSON.stringify(payload)) },
  }
}
