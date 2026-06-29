import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { errorResponse, unauthorizedResponse } from '@/lib/api-helpers';
import { mergePDFs, splitPDF, compressPDF, rotatePDFPages, reorderPages, deletePages, extractPages, addWatermark, protectPDF, unlockPDF, flattenPDF, signPDF } from '@/lib/pdf/engine';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const formData = await request.formData();
    const tool = formData.get('tool') as string;
    if (!tool) return errorResponse('Tool is required', 400);

    const fileEntries = formData.getAll('file');
    if (!fileEntries.length) return errorResponse('No files provided', 400);

    const buffers: Buffer[] = await Promise.all(
      fileEntries.map(async (entry) => {
        if (entry instanceof File) return Buffer.from(await entry.arrayBuffer());
        throw new Error('Invalid file entry');
      })
    );

    const config: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'tool' && key !== 'file') {
        config[key] = value;
      }
    }

    let resultBuffers: Buffer[] = [];
    let outputName = 'processed.pdf';

    switch (tool) {
      case 'merge-pdf': {
        const merged = await mergePDFs(buffers);
        resultBuffers = [merged];
        outputName = 'merged.pdf';
        break;
      }
      case 'split-pdf': {
        const rangeStr = config.range as string | undefined;
        let ranges: { start: number; end: number }[] | undefined;
        if (rangeStr?.trim()) {
          ranges = rangeStr.split(',').map((part) => {
            const [s, e] = part.trim().split('-').map(Number);
            return { start: s, end: e ?? s };
          });
        }
        resultBuffers = await splitPDF(buffers[0], ranges);
        outputName = 'split.pdf';
        break;
      }
      case 'compress-pdf': {
        const quality = Number(config.quality) || 70;
        resultBuffers = [await compressPDF(buffers[0], quality)];
        outputName = 'compressed.pdf';
        break;
      }
      case 'rotate-pdf': {
        const degrees = Number(config.degrees) || 90;
        const pdf = await PDFDocument.load(buffers[0]);
        const allPages = pdf.getPageIndices().map((i) => i + 1);
        resultBuffers = [await rotatePDFPages(buffers[0], allPages, degrees)];
        outputName = 'rotated.pdf';
        break;
      }
      case 'watermark-pdf': {
        const text = (config.watermarkText as string) || 'WATERMARK';
        const opacity = Number(config.opacity) / 100 || 0.2;
        resultBuffers = [await addWatermark(buffers[0], text, opacity)];
        outputName = 'watermarked.pdf';
        break;
      }
      case 'unlock-pdf': {
        const password = (config.password as string) || '';
        resultBuffers = [await unlockPDF(buffers[0], password)];
        outputName = 'unlocked.pdf';
        break;
      }
      case 'protect-pdf': {
        resultBuffers = [await protectPDF(buffers[0], (config.password as string) || '')];
        outputName = 'protected.pdf';
        break;
      }
      case 'sign-pdf': {
        const signatureText = config.signatureText as string | undefined;
        resultBuffers = [await signPDF(buffers[0], undefined, signatureText)];
        outputName = 'signed.pdf';
        break;
      }
      case 'organize-pdf': {
        let currentBuffer = buffers[0];
        const orderStr = config.order as string | undefined;
        const deletePagesStr = config.deletePages as string | undefined;
        const extractPagesStr = config.extractPages as string | undefined;
        if (orderStr?.trim()) {
          const order = orderStr.split(',').map(Number).filter((n) => !isNaN(n));
          if (order.length > 0) currentBuffer = await reorderPages(currentBuffer, order);
        }
        if (deletePagesStr?.trim()) {
          const pagesToDelete = deletePagesStr.split(',').map(Number).filter(Boolean);
          if (pagesToDelete.length > 0) currentBuffer = await deletePages(currentBuffer, pagesToDelete);
        }
        if (extractPagesStr?.trim()) {
          const pagesToExtract = extractPagesStr.split(',').map(Number).filter(Boolean);
          if (pagesToExtract.length > 0) currentBuffer = await extractPages(currentBuffer, pagesToExtract);
        }
        resultBuffers = [currentBuffer];
        outputName = 'organized.pdf';
        break;
      }
      case 'repair-pdf': {
        resultBuffers = [buffers[0]];
        outputName = 'repaired.pdf';
        break;
      }
      case 'images-to-pdf': {
        const pdfDoc = await PDFDocument.create();
        for (const buf of buffers) {
          let image;
          try { image = await pdfDoc.embedJpg(buf); }
          catch { image = await pdfDoc.embedPng(buf); }
          const page = pdfDoc.addPage([image.width, image.height]);
          page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }
        resultBuffers = [Buffer.from(await pdfDoc.save())];
        outputName = 'images.pdf';
        break;
      }
      default:
        return errorResponse(`Tool "${tool}" is not supported`, 400);
    }

    // Single file — return directly as download
    if (resultBuffers.length === 1) {
      return new NextResponse(resultBuffers[0] as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${outputName}"`,
          'Content-Length': resultBuffers[0].length.toString(),
        },
      });
    }

    // Multiple files (split) — return as JSON with base64 blobs
    return NextResponse.json({
      success: true,
      files: resultBuffers.map((buf, i) => ({
        name: `page-${i + 1}.pdf`,
        data: buf.toString('base64'),
      })),
    });
  } catch (error) {
    console.error('Process error:', error);
    return errorResponse(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}
