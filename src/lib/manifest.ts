import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface PackageJson {
  name?: string
  version?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  repository?: string | { type: string, url: string }
  homepage?: string
}

/**
 * Read and parse package.json from the given directory.
 * Returns the parsed manifest or throws if not found/invalid.
 */
export async function readPackageManifest (cwd: string): Promise<PackageJson> {
  const pkgPath = join(cwd, 'package.json')
  try {
    const content = await readFile(pkgPath, 'utf-8')
    return JSON.parse(content) as PackageJson
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`Failed to read package.json: ${message}`, { cause: err })
  }
}

/**
 * Extract dependency names from package.json.
 * Optionally include devDependencies.
 */
export function extractDependencies (
  pkg: PackageJson,
  includeDev: boolean
): string[] {
  const deps = new Set<string>()

  if (pkg.dependencies) {
    for (const name of Object.keys(pkg.dependencies)) {
      deps.add(name)
    }
  }

  if (includeDev && pkg.devDependencies) {
    for (const name of Object.keys(pkg.devDependencies)) {
      deps.add(name)
    }
  }

  return Array.from(deps).sort()
}
