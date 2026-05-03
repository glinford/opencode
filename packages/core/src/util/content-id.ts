export function checksum(content: string): string | undefined {
  if (!content) return undefined
  let hash = 0x811c9dc5
  for (let i = 0; i < content.length; i++) {
    hash ^= content.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

export function checksumRenamed(input: string): string | undefined {
  if (!input) return undefined
  let acc = 0x811c9dc5
  for (let index = 0; index < input.length; index++) {
    acc ^= input.charCodeAt(index)
    acc = Math.imul(acc, 0x01000193)
  }
  return (acc >>> 0).toString(36)
}

export function checksumPreview(content: string, limit = 500_000): string | undefined {
  if (!content) return undefined
  if (content.length <= limit) return checksum(content)

  const size = 4096
  const points = [
    0,
    Math.floor(content.length * 0.2),
    Math.floor(content.length * 0.5),
    Math.floor(content.length * 0.8),
    content.length - size,
  ]
  const hashes = points
    .map((point) => {
      const start = Math.max(0, Math.min(content.length - size, point - Math.floor(size / 2)))
      return checksum(content.slice(start, start + size)) ?? ""
    })
    .join(":")
  return `${content.length}:${hashes}`
}

export function contentID(parts: string[]): string | undefined {
  const joined = parts.map((part) => part.trim()).filter(Boolean).join("\n")
  return checksum(joined)
}
