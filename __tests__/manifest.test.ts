import { test, describe } from 'node:test'
import assert from 'node:assert'
import { extractDependencies } from '../src/lib/manifest.ts'
import type { PackageJson } from '../src/lib/manifest.ts'

describe('manifest', () => {
  test('extracts dependencies only by default', () => {
    const pkg: PackageJson = {
      dependencies: { express: '^4.0.0', lodash: '^4.17.0' },
      devDependencies: { typescript: '^5.0.0' },
    }
    const deps = extractDependencies(pkg, false)
    assert.deepStrictEqual(deps, ['express', 'lodash'])
  })

  test('includes devDependencies when requested', () => {
    const pkg: PackageJson = {
      dependencies: { express: '^4.0.0' },
      devDependencies: { typescript: '^5.0.0', vitest: '^1.0.0' },
    }
    const deps = extractDependencies(pkg, true)
    assert.deepStrictEqual(deps, ['express', 'typescript', 'vitest'])
  })

  test('handles missing dependencies', () => {
    const pkg: PackageJson = {}
    const deps = extractDependencies(pkg, false)
    assert.deepStrictEqual(deps, [])
  })

  test('deduplicates and sorts', () => {
    const pkg: PackageJson = {
      dependencies: { zod: '^3.0.0', axios: '^1.0.0' },
      devDependencies: { axios: '^1.0.0' },
    }
    const deps = extractDependencies(pkg, true)
    assert.deepStrictEqual(deps, ['axios', 'zod'])
  })
})
