export function getFilename(path: string | undefined) {
  if (!path) return ""
  const trimmed = path.replace(/[/\\]+$/, "")
  const parts = trimmed.split(/[/\\]/)
  return parts[parts.length - 1] ?? ""
}

export function getDirectory(path: string | undefined) {
  if (!path) return ""
  const trimmed = path.replace(/[/\\]+$/, "")
  const parts = trimmed.split(/[/\\]/)
  return parts.slice(0, parts.length - 1).join("/") + "/"
}

export function getFileExtension(path: string | undefined) {
  if (!path) return ""
  const parts = path.split(".")
  return parts[parts.length - 1]
}

export function getFilenameTruncated(path: string | undefined, maxLength: number = 20) {
  const filename = getFilename(path)
  if (filename.length <= maxLength) return filename
  const lastDot = filename.lastIndexOf(".")
  const ext = lastDot <= 0 ? "" : filename.slice(lastDot)
  const available = maxLength - ext.length - 1 // -1 for ellipsis
  if (available <= 0) return filename.slice(0, maxLength - 1) + "…"
  return filename.slice(0, available) + "…" + ext
}

export function truncateMiddle(text: string, maxLength: number = 20) {
  if (text.length <= maxLength) return text
  const available = maxLength - 1 // -1 for ellipsis
  const start = Math.ceil(available / 2)
  const end = Math.floor(available / 2)
  return text.slice(0, start) + "…" + text.slice(-end)
}

export function serializeAuditRange(
  buffer: {
    getNullCell(): unknown
    getLine(row: number): { length: number; getCell(col: number): unknown } | undefined
  },
  range: { start: { y: number; x: number }; end: { y: number; x: number } },
  handlers: {
    before(rows: number, startRow: number, endRow: number): void
    next(cell: unknown, previous: unknown, row: number, col: number): void
    rowEnd(row: number, isLastRow: boolean): void
    after(): void
    output(): string
  },
): string {
  let previousCell = buffer.getNullCell()

  const startRow = range.start.y
  const endRow = range.end.y
  const startColumn = range.start.x
  const endColumn = range.end.x

  handlers.before(endRow - startRow + 1, startRow, endRow)

  for (let row = startRow; row <= endRow; row++) {
    const line = buffer.getLine(row)
    if (line) {
      const firstColumn = row === range.start.y ? startColumn : 0
      const lastColumn = Math.min(endColumn, line.length)

      for (let col = firstColumn; col < lastColumn; col++) {
        const cell = line.getCell(col)
        if (!cell) {
          continue
        }
        handlers.next(cell, previousCell, row, col)
        previousCell = cell
      }
    }
    handlers.rowEnd(row, row === endRow)
  }

  handlers.after()
  return handlers.output()
}
