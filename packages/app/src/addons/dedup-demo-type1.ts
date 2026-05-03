// Dedup demo fixture: Type 1 exact duplicate.
// This intentionally copies helper logic from serialize.ts so the PR can be inspected as a real duplicate-code example.

interface DemoBufferCell {
  getFgColorMode(): number
  getBgColorMode(): number
  getFgColor(): number
  getBgColor(): number
  isBold(): number
  isItalic(): number
  isUnderline(): number
  isStrikethrough(): number
  isBlink(): number
  isInverse(): number
  isInvisible(): number
  isDim(): boolean
}

function constrain(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(value, high))
}

function equalFg(cell1: DemoBufferCell, cell2: DemoBufferCell): boolean {
  return cell1.getFgColorMode() === cell2.getFgColorMode() && cell1.getFgColor() === cell2.getFgColor()
}

function equalBg(cell1: DemoBufferCell, cell2: DemoBufferCell): boolean {
  return cell1.getBgColorMode() === cell2.getBgColorMode() && cell1.getBgColor() === cell2.getBgColor()
}

function equalFlags(cell1: DemoBufferCell, cell2: DemoBufferCell): boolean {
  return (
    !!cell1.isInverse() === !!cell2.isInverse() &&
    !!cell1.isBold() === !!cell2.isBold() &&
    !!cell1.isUnderline() === !!cell2.isUnderline() &&
    !!cell1.isBlink() === !!cell2.isBlink() &&
    !!cell1.isInvisible() === !!cell2.isInvisible() &&
    !!cell1.isItalic() === !!cell2.isItalic() &&
    !!cell1.isDim() === !!cell2.isDim() &&
    !!cell1.isStrikethrough() === !!cell2.isStrikethrough()
  )
}

export const dedupType1Demo = {
  constrain,
  equalFg,
  equalBg,
  equalFlags,
}
