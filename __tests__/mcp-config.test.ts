import { test, describe, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert'
import { readMcpConfig, updateMcpConfig } from '../src/lib/mcp-config.ts'
import { writeFile, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import type { GitMcpServer } from '../src/lib/gitmcp.ts'

describe('mcp-config', () => {
  let testDir: string

  beforeEach(async () => {
    testDir = join(tmpdir(), `automcp-test-${Date.now()}`)
    await mkdir(testDir, { recursive: true })
  })

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true })
  })

  test('reads empty config for non-existent file', async () => {
    const configPath = join(testDir, 'mcp.json')
    const config = await readMcpConfig(configPath)
    assert.deepStrictEqual(config, { mcpServers: {} })
  })

  test('reads valid JSON config', async () => {
    const configPath = join(testDir, 'mcp.json')
    const content = {
      mcpServers: {
        test: { url: 'https://example.com' },
      },
    }
    await writeFile(configPath, JSON.stringify(content, null, 2))
    const config = await readMcpConfig(configPath)
    assert.strictEqual(config.mcpServers?.test?.url, 'https://example.com')
  })

  test('reads JSONC with comments', async () => {
    const configPath = join(testDir, 'mcp.json')
    await writeFile(configPath, `{
  // This is a comment
  "mcpServers": {
    "test": { "url": "https://example.com" } // inline comment
  }
}`)
    const config = await readMcpConfig(configPath)
    assert.strictEqual(config.mcpServers?.test?.url, 'https://example.com')
  })

  test('handles trailing commas in JSONC', async () => {
    const configPath = join(testDir, 'mcp.json')
    await writeFile(configPath, `{
  "mcpServers": {
    "test": { "url": "https://example.com" },
  },
}`)
    const config = await readMcpConfig(configPath)
    assert.strictEqual(config.mcpServers?.test?.url, 'https://example.com')
  })

  test('adds new servers in dry-run mode', async () => {
    const configPath = join(testDir, 'mcp.json')
    const servers: GitMcpServer[] = [
      { name: 'express Docs', url: 'https://gitmcp.io/expressjs/express' },
    ]
    const result = await updateMcpConfig(configPath, servers, true)
    assert.strictEqual(result.added.length, 1)
    assert.strictEqual(result.skipped.length, 0)
    // File should not be created in dry-run
    const config = await readMcpConfig(configPath)
    assert.deepStrictEqual(config, { mcpServers: {} })
  })

  test('adds new servers and writes config', async () => {
    const configPath = join(testDir, 'mcp.json')
    const servers: GitMcpServer[] = [
      { name: 'express Docs', url: 'https://gitmcp.io/expressjs/express' },
      { name: 'lodash Docs', url: 'https://gitmcp.io/lodash/lodash' },
    ]
    const result = await updateMcpConfig(configPath, servers, false)
    assert.strictEqual(result.added.length, 2)
    assert.strictEqual(result.skipped.length, 0)

    const config = await readMcpConfig(configPath)
    assert.ok(config.mcpServers?.['express Docs'])
    assert.ok(config.mcpServers?.['lodash Docs'])
  })

  test('skips duplicate URLs', async () => {
    const configPath = join(testDir, 'mcp.json')
    const content = {
      mcpServers: {
        existing: { url: 'https://gitmcp.io/expressjs/express' },
      },
    }
    await writeFile(configPath, JSON.stringify(content, null, 2))

    const servers: GitMcpServer[] = [
      { name: 'express Docs', url: 'https://gitmcp.io/expressjs/express' },
      { name: 'lodash Docs', url: 'https://gitmcp.io/lodash/lodash' },
    ]
    const result = await updateMcpConfig(configPath, servers, false)
    assert.strictEqual(result.added.length, 1)
    assert.strictEqual(result.skipped.length, 1)
    assert.strictEqual(result.skipped[0]?.name, 'express Docs')
  })

  test('normalizes URLs for duplicate detection', async () => {
    const configPath = join(testDir, 'mcp.json')
    const content = {
      mcpServers: {
        existing: { url: 'https://gitmcp.io/expressjs/express/' }, // trailing slash
      },
    }
    await writeFile(configPath, JSON.stringify(content, null, 2))

    const servers: GitMcpServer[] = [
      { name: 'express Docs', url: 'https://gitmcp.io/expressjs/express' }, // no trailing slash
    ]
    const result = await updateMcpConfig(configPath, servers, false)
    assert.strictEqual(result.added.length, 0)
    assert.strictEqual(result.skipped.length, 1)
  })

  test('handles name collisions', async () => {
    const configPath = join(testDir, 'mcp.json')
    const content = {
      mcpServers: {
        'express Docs': { url: 'https://gitmcp.io/other/express' },
      },
    }
    await writeFile(configPath, JSON.stringify(content, null, 2))

    const servers: GitMcpServer[] = [
      { name: 'express Docs', url: 'https://gitmcp.io/expressjs/express' },
    ]
    const result = await updateMcpConfig(configPath, servers, false)
    assert.strictEqual(result.added.length, 1)
    assert.strictEqual(result.added[0]?.name, 'express Docs (2)')

    const config = await readMcpConfig(configPath)
    assert.ok(config.mcpServers?.['express Docs (2)'])
  })
})
