import { test, describe } from 'node:test'
import assert from 'node:assert'
import { buildGitMcpServer, buildGitMcpServers } from '../src/lib/gitmcp.ts'
import type { RepoInfo } from '../src/lib/npm-repo-resolver.ts'

describe('gitmcp', () => {
  test('builds a GitMCP server from repo info', () => {
    const repo: RepoInfo = { owner: 'expressjs', repo: 'express' }
    const server = buildGitMcpServer(repo)
    assert.strictEqual(server.name, 'express Docs')
    assert.strictEqual(server.url, 'https://gitmcp.io/expressjs/express')
  })

  test('deduplicates by URL', () => {
    const repos = new Map<string, RepoInfo | null>([
      ['express', { owner: 'expressjs', repo: 'express' }],
      ['express-alias', { owner: 'expressjs', repo: 'express' }], // Same repo
      ['lodash', { owner: 'lodash', repo: 'lodash' }],
    ])
    const servers = buildGitMcpServers(repos)
    assert.strictEqual(servers.length, 2)
    assert.ok(servers.some(s => s.url === 'https://gitmcp.io/expressjs/express'))
    assert.ok(servers.some(s => s.url === 'https://gitmcp.io/lodash/lodash'))
  })

  test('handles name collisions', () => {
    const repos = new Map<string, RepoInfo | null>([
      ['pkg1', { owner: 'org1', repo: 'utils' }],
      ['pkg2', { owner: 'org2', repo: 'utils' }],
    ])
    const servers = buildGitMcpServers(repos)
    assert.strictEqual(servers.length, 2)
    assert.ok(servers.some(s => s.name === 'utils Docs'))
    assert.ok(servers.some(s => s.name === 'utils Docs (2)'))
  })

  test('skips null repos', () => {
    const repos = new Map<string, RepoInfo | null>([
      ['express', { owner: 'expressjs', repo: 'express' }],
      ['no-repo', null],
    ])
    const servers = buildGitMcpServers(repos)
    assert.strictEqual(servers.length, 1)
    assert.strictEqual(servers[0]?.name, 'express Docs')
  })
})
