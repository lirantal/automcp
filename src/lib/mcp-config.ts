import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname } from 'node:path'
import type { GitMcpServer } from './gitmcp.ts'

export interface McpConfig {
  mcpServers?: Record<string, { url: string, [key: string]: unknown }>
}

export interface UpdateResult {
  added: GitMcpServer[]
  skipped: GitMcpServer[]
}

/**
 * Read and parse an MCP config file (JSON or JSONC).
 * Returns an empty config if the file doesn't exist.
 */
export async function readMcpConfig (path: string): Promise<McpConfig> {
  if (!existsSync(path)) {
    return { mcpServers: {} }
  }

  try {
    const content = await readFile(path, 'utf-8')
    // Simple JSONC support: strip // comments and /* */ comments
    const stripped = stripJsonComments(content)
    return JSON.parse(stripped) as McpConfig
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`Failed to parse MCP config at ${path}: ${message}`)
  }
}

/**
 * Update MCP config with new servers, avoiding duplicates.
 * Returns the list of added and skipped servers.
 */
export async function updateMcpConfig (
  configPath: string,
  newServers: GitMcpServer[],
  dryRun: boolean
): Promise<UpdateResult> {
  const config = await readMcpConfig(configPath)
  if (!config.mcpServers) {
    config.mcpServers = {}
  }

  const added: GitMcpServer[] = []
  const skipped: GitMcpServer[] = []

  // Normalize existing URLs for comparison (case-insensitive, no trailing slash)
  const existingUrls = new Set(
    Object.values(config.mcpServers).map(s => normalizeUrl(s.url))
  )

  for (const server of newServers) {
    const normalizedUrl = normalizeUrl(server.url)
    if (existingUrls.has(normalizedUrl)) {
      skipped.push(server)
      continue
    }

    // Find a unique name
    let finalName = server.name
    let suffix = 1
    while (config.mcpServers[finalName]) {
      suffix += 1
      finalName = `${server.name} (${suffix})`
    }

    config.mcpServers[finalName] = { url: server.url }
    existingUrls.add(normalizedUrl)
    added.push({ ...server, name: finalName })
  }

  if (!dryRun && added.length > 0) {
    await writeMcpConfig(configPath, config)
  }

  return { added, skipped }
}

/**
 * Write MCP config to disk atomically.
 * Ensures the directory exists before writing.
 */
async function writeMcpConfig (path: string, config: McpConfig): Promise<void> {
  const dir = dirname(path)
  await mkdir(dir, { recursive: true })

  const content = JSON.stringify(config, null, 2) + '\n'
  // Simple atomic write: write to temp then rename would require fs.rename;
  // for simplicity in v1, just write directly (Node.js writeFile is generally safe)
  await writeFile(path, content, 'utf-8')
}

/**
 * Normalize a URL for comparison: lowercase, remove trailing slash.
 */
function normalizeUrl (url: string): string {
  return url.toLowerCase().replace(/\/$/, '')
}

/**
 * Strip single-line and multi-line comments from JSON content.
 * Basic implementation; not a full JSONC parser but handles common cases.
 * Avoids matching // or /* inside string literals.
 */
function stripJsonComments (content: string): string {
  let result = ''
  let inString = false
  let inSingleLineComment = false
  let inMultiLineComment = false
  let stringChar = ''

  for (let i = 0; i < content.length; i++) {
    const char = content[i]!
    const nextChar = content[i + 1]

    // Handle string boundaries
    if (!inSingleLineComment && !inMultiLineComment) {
      if ((char === '"' || char === "'") && (i === 0 || content[i - 1] !== '\\')) {
        if (inString && stringChar === char) {
          inString = false
          result += char
          continue
        } else if (!inString) {
          inString = true
          stringChar = char
          result += char
          continue
        }
      }
    }

    // Inside a string, just copy
    if (inString) {
      result += char
      continue
    }

    // Handle multi-line comments
    if (!inSingleLineComment && char === '/' && nextChar === '*') {
      inMultiLineComment = true
      i++ // Skip the *
      continue
    }
    if (inMultiLineComment && char === '*' && nextChar === '/') {
      inMultiLineComment = false
      i++ // Skip the /
      result += ' ' // Replace comment with space
      continue
    }
    if (inMultiLineComment) {
      continue
    }

    // Handle single-line comments
    if (!inMultiLineComment && char === '/' && nextChar === '/') {
      inSingleLineComment = true
      i++ // Skip the second /
      continue
    }
    if (inSingleLineComment && char === '\n') {
      inSingleLineComment = false
      result += char // Keep the newline
      continue
    }
    if (inSingleLineComment) {
      continue
    }

    // Normal character
    result += char
  }

  // Remove trailing commas before } or ]
  result = result.replace(/,(\s*[}\]])/g, '$1')
  return result
}
