export function checksum(content: string): string | undefined {
  if (!content) return undefined
  let hash = 0x811c9dc5
  for (let i = 0; i < content.length; i++) {
    hash ^= content.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

export function contentID(parts: string[]): string | undefined {
  const joined = parts.map((part) => part.trim()).filter(Boolean).join("\n")
  return checksum(joined)
}
