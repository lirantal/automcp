import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export interface RepoInfo {
  owner: string
  repo: string
}

/**
 * Resolve a package name to its GitHub owner/repo.
 * Uses `npm view <pkg> repository.url` and normalizes GitHub URLs.
 * Returns null if the package doesn't have a GitHub repo or resolution fails.
 */
export async function resolveGitHubRepo (
  packageName: string
): Promise<RepoInfo | null> {
  try {
    const { stdout } = await execAsync(`npm view ${packageName} repository.url`, {
      timeout: 10000,
      encoding: 'utf-8',
    })
    const url = stdout.trim()
    if (!url) return null
    return parseGitHubUrl(url)
  } catch {
    // npm view failed (404, timeout, etc.)
    return null
  }
}

/**
 * Parse a GitHub URL (git+https, https, ssh) into owner/repo.
 * Returns null if not a GitHub URL or parsing fails.
 */
export function parseGitHubUrl (url: string): RepoInfo | null {
  // Normalize git+https:// → https://
  let normalized = url.replace(/^git\+/, '')

  // Remove .git suffix
  normalized = normalized.replace(/\.git$/, '')

  // Match github.com patterns
  const httpsMatch = normalized.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\/|$)/)
  if (httpsMatch) {
    return { owner: httpsMatch[1]!, repo: httpsMatch[2]! }
  }

  // SSH pattern: git@github.com:owner/repo
  const sshMatch = normalized.match(/git@github\.com:([^/]+)\/(.+)/)
  if (sshMatch) {
    return { owner: sshMatch[1]!, repo: sshMatch[2]! }
  }

  return null
}

/**
 * Resolve multiple packages concurrently with a concurrency limit.
 * Returns a map of packageName → RepoInfo | null.
 */
export async function resolveMultiple (
  packages: string[],
  concurrency = 5
): Promise<Map<string, RepoInfo | null>> {
  const results = new Map<string, RepoInfo | null>()
  const queue = [...packages]
  const active: Promise<void>[] = []

  async function worker (): Promise<void> {
    while (queue.length > 0) {
      const pkg = queue.shift()
      if (!pkg) break
      const result = await resolveGitHubRepo(pkg)
      results.set(pkg, result)
    }
  }

  for (let i = 0; i < concurrency; i++) {
    active.push(worker())
  }

  await Promise.all(active)
  return results
}
