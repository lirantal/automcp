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

export interface ServerEntry {
  name: string
  url: string
}

export interface AutomcpResult {
  added: number
  skipped: number
  errors: number
  addedServers: ServerEntry[]
  skippedServers: ServerEntry[]
  configPath: string
  agentName: string
  dryRun: boolean
}
