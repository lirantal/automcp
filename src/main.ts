import type { AutomcpResult, CliOptions } from './lib/types.ts'

// Temporary stub for M1: define shape and return a no-op result to enable CLI wiring and tests
export async function runAutomcp (_options: CliOptions): Promise<AutomcpResult> {
  return {
    added: 0,
    skipped: 0,
    errors: 0,
  }
}
