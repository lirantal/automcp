import { test, describe } from 'node:test'
import assert from 'node:assert'
import { parseGitHubUrl } from '../src/lib/npm-repo-resolver.ts'

describe('npm-repo-resolver', () => {
  test('parses git+https GitHub URLs', () => {
    const result = parseGitHubUrl('git+https://github.com/expressjs/express.git')
    assert.deepStrictEqual(result, { owner: 'expressjs', repo: 'express' })
  })

  test('parses https GitHub URLs', () => {
    const result = parseGitHubUrl('https://github.com/lodash/lodash')
    assert.deepStrictEqual(result, { owner: 'lodash', repo: 'lodash' })
  })

  test('parses SSH GitHub URLs', () => {
    const result = parseGitHubUrl('git@github.com:npm/cli.git')
    assert.deepStrictEqual(result, { owner: 'npm', repo: 'cli' })
  })

  test('returns null for non-GitHub URLs', () => {
    const result = parseGitHubUrl('https://gitlab.com/foo/bar')
    assert.strictEqual(result, null)
  })

  test('handles URLs without .git suffix', () => {
    const result = parseGitHubUrl('https://github.com/webpack/webpack')
    assert.deepStrictEqual(result, { owner: 'webpack', repo: 'webpack' })
  })
})
