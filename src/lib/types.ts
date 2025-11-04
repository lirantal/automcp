export interface CliOptions {
  dryRun: boolean
  agent?: string
  config?: string
  includeDev: boolean
  silent: boolean
  json: boolean
  help: boolean
  version: boolean
}

export interface AutomcpResult {
  added: number
  skipped: number
  errors: number
}
