import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { errorResponse, unauthorizedResponse } from '@/lib/api-helpers';
import { PDFDocument } from 'pdf-lib';
import { calculateBookletLayout } from '@/lib/print/booklet-optimizer';

const MARGIN = 20;

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const formData = await request.formData();
    const tool = formData.get('tool') as string;
    if (!tool) return errorResponse('Tool is required', 400);

    const fileEntry = formData.get('file');
    if (!fileEntry) return errorResponse('No file provided', 400);
    const file = fileEntry instanceof File ? fileEntry : null;
    if (!file) return errorResponse('Invalid file', 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    const srcPdf = await PDFDocument.load(buffer);
    const totalPages = srcPdf.getPageCount();

    if (tool === 'smart-print') {
      const orientation = (formData.get('orientation') as string) || 'auto';
      const customScale = parseInt(formData.get('scale') as string) || 100;
      const pagesPerSheet = 2;

      const { width: srcW, height: srcH } = srcPdf.getPage(0).getSize();
      const cols = 1;
      const rows = 1;
      const cellW = srcW + MARGIN;
      const cellH = srcH + MARGIN;
      const outputW = cols * cellW + MARGIN;
      const outputH = rows * cellH + MARGIN;
      const scale = (customScale / 100) * Math.min((outputW - 2 * MARGIN) / srcW, (outputH - 2 * MARGIN) / srcH, 1);

      const newPdf = await PDFDocument.create();

      for (let i = 0; i < totalPages; i++) {
        const page = newPdf.addPage([outputW, outputH]);
        const [copiedPage] = await newPdf.copyPages(srcPdf, [i]);
        const embedded = await newPdf.embedPage(copiedPage);
        const x = (outputW - scale * srcW) / 2;
        const y = (outputH - scale * srcH) / 2;
        page.drawPage(embedded, { x, y, xScale: scale, yScale: scale });
      }

      const resultBytes = Buffer.from(await newPdf.save());
      return new Response(resultBytes as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${file.name.replace(/\.pdf$/i, '')}-smart.pdf"`,
        },
      });
    }

    const rows = parseInt(formData.get('rows') as string) || 2;
    const cols = parseInt(formData.get('cols') as string) || 2;

    const layout = calculateBookletLayout(totalPages, rows, cols);

    const newPdf = await PDFDocument.create();

    for (const sheet of layout) {
      const [srcW, srcH] = [srcPdf.getPage(0).getWidth(), srcPdf.getPage(0).getHeight()];
      const cellW = srcW + MARGIN;
      const cellH = srcH + MARGIN;
      const outputW = cols * cellW + MARGIN;
      const outputH = rows * cellH + MARGIN;

      const scaleX = (outputW - (cols + 1) * MARGIN) / (cols * srcW);
      const scaleY = (outputH - (rows + 1) * MARGIN) / (rows * srcH);
      const sc = Math.min(scaleX, scaleY, 1);

      const renderSide = async (pageIndices: number[][]) => {
        const page = newPdf.addPage([outputW, outputH]);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const srcIdx = pageIndices[r][c];
            if (srcIdx < 0 || srcIdx >= totalPages) continue;

            const [copiedPage] = await newPdf.copyPages(srcPdf, [srcIdx]);
            const embedded = await newPdf.embedPage(copiedPage);

            const x = MARGIN + c * (sc * srcW + MARGIN);
            const y = outputH - MARGIN - (r + 1) * sc * srcH - r * MARGIN;

            page.drawPage(embedded, { x, y, xScale: sc, yScale: sc });
          }
        }
      };

      await renderSide(sheet.front);
      await renderSide(sheet.back);
    }

    const resultBytes = Buffer.from(await newPdf.save());
    return new Response(resultBytes as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.pdf$/i, '')}-booklet-${rows}x${cols}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Print error:', error);
    return errorResponse(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}
