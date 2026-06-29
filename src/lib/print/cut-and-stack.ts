import type { CutAndStackConfig, CutAndStackResult } from "@/types";

interface SheetCell {
  row: number;
  col: number;
  pageNum: number;
  isBlank: boolean;
}

interface SheetSide {
  sheetNum: number;
  side: "front" | "back";
  stackNum: number;
  pages: SheetCell[];
}

export function calculateCutAndStack(
  config: CutAndStackConfig,
  totalPages: number
): CutAndStackResult {
  const R = Math.max(1, config.rows);
  const C = Math.max(1, config.columns);
  const K = R * C;
  const pagesPerSheet = 2 * K;

  let blankPagesAdded = 0;
  let paddedTotal = totalPages;

  if (config.autoPadding && totalPages > 0) {
    const remainder = totalPages % pagesPerSheet;
    if (remainder !== 0) {
      blankPagesAdded = pagesPerSheet - remainder;
      paddedTotal = totalPages + blankPagesAdded;
    }
  }

  if (totalPages === 0) {
    return {
      frontSheets: 0,
      backSheets: 0,
      totalSheets: 0,
      pagesPerSheet: K,
      gridCapacity: K,
      totalPages: 0,
      blankPagesAdded: 0,
      stacks: [],
      sheets: [],
    };
  }

  const totalPhysicalSheets = Math.ceil(paddedTotal / pagesPerSheet);
  const sheetsPerStack = Math.max(1, K);
  const numberOfStacks = Math.ceil(totalPhysicalSheets / sheetsPerStack);

  const stacks: CutAndStackResult["stacks"] = [];
  const sheets: CutAndStackResult["sheets"] = [];

  for (let stackIdx = 0; stackIdx < numberOfStacks; stackIdx++) {
    const stackNum = stackIdx + 1;
    const startSheet = stackIdx * sheetsPerStack;
    const endSheet = Math.min(startSheet + sheetsPerStack, totalPhysicalSheets);
    const stackFrontPages: number[] = [];
    const stackBackPages: number[] = [];

    for (let localSheetIdx = startSheet; localSheetIdx < endSheet; localSheetIdx++) {
      const globalSheetIdx = localSheetIdx;
      const sheetNum = globalSheetIdx + 1;

      /* Front side: Front(r,c) = 2((r-1)*C + c) - 1 */
      const frontPages: CutAndStackResult["sheets"][number]["pages"] = [];
      for (let r = 1; r <= R; r++) {
        for (let c = 1; c <= C; c++) {
          const s = (r - 1) * C + c;
          const raw = 2 * K * globalSheetIdx + 2 * s - 1;
          const isBlank = raw > totalPages;
          const pageNum = isBlank ? 0 : raw;
          frontPages.push({ row: r, col: c, pageNum });
          if (!isBlank) stackFrontPages.push(raw);
        }
      }

      /* Back side: Back(r,c) = 2((r-1)*C + (C-c+1)) */
      const backPages: CutAndStackResult["sheets"][number]["pages"] = [];
      for (let r = 1; r <= R; r++) {
        for (let c = 1; c <= C; c++) {
          const revC = C - c + 1;
          const raw = 2 * K * globalSheetIdx + 2 * ((r - 1) * C + revC);
          const isBlank = raw > totalPages;
          const pageNum = isBlank ? 0 : raw;
          backPages.push({ row: r, col: c, pageNum });
          if (!isBlank) stackBackPages.push(raw);
        }
      }

      sheets.push({ sheetNum, side: "front", stackNum, pages: frontPages });
      sheets.push({ sheetNum, side: "back", stackNum, pages: backPages });
    }

    stacks.push({
      stackNum,
      frontPages: [...new Set(stackFrontPages)].sort((a, b) => a - b),
      backPages: [...new Set(stackBackPages)].sort((a, b) => a - b),
    });
  }

  return {
    frontSheets: totalPhysicalSheets,
    backSheets: totalPhysicalSheets,
    totalSheets: totalPhysicalSheets,
    pagesPerSheet: K,
    gridCapacity: K,
    totalPages: paddedTotal,
    blankPagesAdded,
    stacks,
    sheets,
  };
}
