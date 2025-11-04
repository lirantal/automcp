import { test, describe, beforeEach, mock } from 'node:test'
import assert from 'node:assert'
import { runAutomcp } from '../src/main.ts'

describe('CLI program', () => {

  beforeEach(() => {
    // Reset the mocks before each test
    mock.reset()
  });

  test('CLI run returns a result shape', async () => {
    const result = await runAutomcp({
      dryRun: true,
      includeDev: false,
      silent: true,
      json: false,
      help: false,
      version: false,
    })
    assert.ok(result)
    assert.strictEqual(typeof result.added, 'number')
    assert.strictEqual(typeof result.skipped, 'number')
    assert.strictEqual(typeof result.errors, 'number')
  })

});