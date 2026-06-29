export interface BookletSheet {
  sheetIndex: number
  front: number[][]
  back: number[][]
}

export function calculateBookletLayout(
  totalPages: number,
  rows: number,
  cols: number
): BookletSheet[] {
  const K = rows * cols
  const pagesPerSheet = 2 * K

  const remainder = totalPages % pagesPerSheet
  const paddedPages = remainder === 0 ? totalPages : totalPages + (pagesPerSheet - remainder)
  const numSheets = paddedPages / pagesPerSheet

  const sheets: BookletSheet[] = []

  for (let i = 0; i < numSheets; i++) {
    const front: number[][] = []
    const back: number[][] = []

    for (let r = 0; r < rows; r++) {
      const frontRow: number[] = []
      const backRow: number[] = []

      for (let c = 0; c < cols; c++) {
        const frontIdx = 2 * (i * K + r * cols + c)
        frontRow.push(frontIdx < totalPages ? frontIdx : -1)

        const backIdx = 2 * (i * K + r * cols + cols - c) - 1
        backRow.push(backIdx < totalPages ? backIdx : -1)
      }

      front.push(frontRow)
      back.push(backRow)
    }

    sheets.push({ sheetIndex: i, front, back })
  }

  return sheets
}
