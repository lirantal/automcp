import type { RepoInfo } from './npm-repo-resolver.ts'

export interface GitMcpServer {
  name: string
  url: string
}

/**
 * Build a GitMCP server entry from GitHub repo info.
 * URL: https://gitmcp.io/<owner>/<repo>
 * Name: <repo> Docs (or disambiguate if collisions exist)
 */
export function buildGitMcpServer (repo: RepoInfo): GitMcpServer {
  return {
    name: `${repo.repo} Docs`,
    url: `https://gitmcp.io/${repo.owner}/${repo.repo}`,
  }
}

/**
 * Build GitMCP servers from multiple repos and deduplicate by URL.
 * Returns a Map of URL → GitMcpServer, ensuring unique URLs and handling name collisions.
 */
export function buildGitMcpServers (
  repos: Map<string, RepoInfo | null>
): GitMcpServer[] {
  const byUrl = new Map<string, GitMcpServer>()
  const nameCount = new Map<string, number>()

  for (const [, repoInfo] of repos) {
    if (!repoInfo) continue
    const server = buildGitMcpServer(repoInfo)

    // Dedupe by URL
    if (byUrl.has(server.url)) continue

    // Handle name collisions by appending (2), (3), etc.
    let finalName = server.name
    const count = nameCount.get(server.name) ?? 0
    if (count > 0) {
      finalName = `${server.name} (${count + 1})`
    }
    nameCount.set(server.name, count + 1)

    byUrl.set(server.url, { ...server, name: finalName })
  }

  return Array.from(byUrl.values())
}
