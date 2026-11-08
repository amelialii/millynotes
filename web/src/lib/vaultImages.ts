// Vite 8: use `?url` + `import: 'default'` (same pattern as notesIndex `?raw`). The old `as: 'url'`
// can yield module objects in the bundle; coercing to string breaks images as `[object Module]`.
const imageModules = import.meta.glob('../../../milynotes vault/**/*.{png,jpg,jpeg,gif,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/** Vault-relative path after `milynotes vault/`, e.g. `Introduction to Database Systems/img/fk.png` */
const urlByVaultRelPath = new Map<string, string>()

for (const [globKey, url] of Object.entries(imageModules)) {
  const normalized = globKey.replace(/\\/g, '/')
  const needle = 'milynotes vault/'
  const i = normalized.lastIndexOf(needle)
  if (i === -1) continue
  const rel = normalized.slice(i + needle.length)
  urlByVaultRelPath.set(rel, url)
}

function parentDir(noteRelativePath: string): string {
  const i = noteRelativePath.lastIndexOf('/')
  if (i === -1) return ''
  return noteRelativePath.slice(0, i)
}

/** For raw `<img alt="...">` — avoid breaking out of the attribute. */
function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

/**
 * Resolve Obsidian wiki image names and relative markdown image paths to Vite asset URLs.
 */
export function resolveVaultImageUrl(
  vaultFolder: string,
  noteRelativePath: string,
  ref: string,
): string | null {
  const trimmed = ref.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  const noteDir = parentDir(noteRelativePath)
  const clean = trimmed.replace(/^\.\//, '').replace(/^\/+/, '')

  const candidates: string[] = []

  if (clean.includes('/')) {
    candidates.push(`${vaultFolder}/${clean}`)
  }

  if (noteDir) {
    candidates.push(`${vaultFolder}/${noteDir}/img/${clean}`)
    candidates.push(`${vaultFolder}/${noteDir}/attachments/${clean}`)
    candidates.push(`${vaultFolder}/${noteDir}/${clean}`)
  } else {
    candidates.push(`${vaultFolder}/img/${clean}`)
    candidates.push(`${vaultFolder}/attachments/${clean}`)
    candidates.push(`${vaultFolder}/${clean}`)
  }

  const baseName = clean.split('/').pop() ?? clean
  if (noteDir && baseName !== clean) {
    candidates.push(`${vaultFolder}/${noteDir}/img/${baseName}`)
    candidates.push(`${vaultFolder}/${noteDir}/attachments/${baseName}`)
  }

  const seen = new Set<string>()
  for (const c of candidates) {
    if (seen.has(c)) continue
    seen.add(c)
    const u = urlByVaultRelPath.get(c)
    if (u) return u
  }

  // Obsidian sometimes stores files in other subfolders under the same section; match by filename.
  const base = baseName
  if (noteDir) {
    const underNote = `${vaultFolder}/${noteDir}/`
    for (const [rel, url] of urlByVaultRelPath) {
      if (rel.startsWith(underNote) && rel.endsWith(`/${base}`)) return url
    }
  }

  const underVault = `${vaultFolder}/`
  const loose: string[] = []
  for (const [rel, url] of urlByVaultRelPath) {
    if (!rel.startsWith(underVault)) continue
    if (rel === `${vaultFolder}/${base}` || rel.endsWith(`/${base}`)) loose.push(url)
  }
  if (loose.length === 1) return loose[0]

  return null
}

/**
 * Convert Obsidian-style `![[file]]` / `![[file|caption]]` / `![[file|width]]` (resize) and fix relative `![](...)` paths.
 * When Obsidian saves a drag-resize, the part after `|` is a pixel width (digits only); that becomes `<img width="...">` so it matches the editor.
 */
export function preprocessVaultMarkdown(
  body: string,
  vaultFolder: string,
  noteRelativePath: string,
): string {
  let out = body

  out = out.replace(/!\[\[([^\]]+)\]\]/g, (full, inner: string) => {
    const parts = inner.split('|')
    const target = parts[0].trim()
    if (!target) return full
    const url = resolveVaultImageUrl(vaultFolder, noteRelativePath, target)
    if (!url) return full
    const alt = target.replace(/\.[^./\\]+$/, '').replace(/[/_-]+/g, ' ')
    const maybeWidth = parts[1]?.trim()
    if (maybeWidth && /^\d+$/.test(maybeWidth)) {
      return `<img src="${url}" alt="${escapeHtmlAttr(alt)}" width="${maybeWidth}" />`
    }
    return `![${alt}](${url})`
  })

  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (full, alt, src: string) => {
    const s = src.trim()
    if (/^https?:\/\//i.test(s)) return full
    const url = resolveVaultImageUrl(vaultFolder, noteRelativePath, s)
    if (!url) return full
    return `![${alt}](${url})`
  })

  return out
}
