import { test, describe, beforeEach, mock } from 'node:test'
import assert from 'node:assert'
import { runAutomcp } from '../src/main.ts'

describe('CLI program', () => {

  beforeEach(() => {
    // Reset the mocks before each test
    mock.reset()
  });

  test('CLI run returns a result shape', async () => {
    // Use dry-run mode and provide explicit overrides to avoid reading actual config files
    const result = await runAutomcp({
      dryRun: true,
      includeDev: false,
      silent: true,
      json: false,
      help: false,
      version: false,
      agent: 'cursor',
      config: '/tmp/test-mcp.json', // Non-existent path for dry-run test
    })
    assert.ok(result)
    assert.strictEqual(typeof result.added, 'number')
    assert.strictEqual(typeof result.skipped, 'number')
    assert.strictEqual(typeof result.errors, 'number')
    assert.ok(Array.isArray(result.addedServers))
    assert.ok(Array.isArray(result.skippedServers))
    assert.strictEqual(typeof result.configPath, 'string')
    assert.strictEqual(typeof result.agentName, 'string')
    assert.strictEqual(typeof result.dryRun, 'boolean')
  })

});