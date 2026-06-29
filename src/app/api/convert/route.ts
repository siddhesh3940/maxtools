import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { errorResponse, unauthorizedResponse } from '@/lib/api-helpers';
import { PDFDocument } from 'pdf-lib';

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
    const baseName = file.name.replace(/\.[^.]+$/, '');

    // Image-to-PDF conversions (jpg → pdf, png → pdf)
    if (tool === 'jpg-to-pdf' || tool === 'png-to-pdf') {
      const pdf = await PDFDocument.create();
      const ext = tool === 'jpg-to-pdf' ? 'jpg' : 'png';
      let image;
      try {
        if (ext === 'jpg') image = await pdf.embedJpg(buffer);
        else image = await pdf.embedPng(buffer);
      } catch {
        return errorResponse(`Could not embed ${ext.toUpperCase()} image. The file may be corrupted or in an unsupported format.`, 400);
      }
      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      return new NextResponse(Buffer.from(await pdf.save()) as unknown as BodyInit, {
        status: 200,
        headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${baseName}.pdf"` },
      });
    }

    // HTML-to-PDF (strip tags, render as plain text)
    if (tool === 'html-to-pdf') {
      const htmlContent = buffer.toString('utf-8');
      const pdf = await PDFDocument.create();
      const page = pdf.addPage([612, 792]);
      const lines = htmlContent.replace(/<[^>]*>/g, '').split('\n').filter(l => l.trim());
      let y = 750;
      for (const line of lines.slice(0, 100)) {
        page.drawText(line.trim().substring(0, 80), { x: 50, y, size: 10 });
        y -= 14;
        if (y < 40) break;
      }
      return new NextResponse(Buffer.from(await pdf.save()) as unknown as BodyInit, {
        status: 200,
        headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${baseName}.pdf"` },
      });
    }

    // Tools that need server-side libraries (return placeholder with info)
    const needsLibrary: Record<string, string> = {
      'pdf-to-word': 'Full PDF-to-Word conversion requires a server-side library like pdfjs-dist + mammoth.',
      'word-to-pdf': 'Full Word-to-PDF conversion requires a server-side library like mammoth.',
      'pdf-to-jpg': 'PDF-to-image requires pdfjs-dist with canvas rendering.',
      'pdf-to-png': 'PDF-to-image requires pdfjs-dist with canvas rendering.',
      'pdf-to-excel': 'PDF-to-Excel conversion requires a server-side parsing library.',
      'excel-to-pdf': 'Excel-to-PDF conversion requires a server-side library like exceljs.',
      'ppt-to-pdf': 'PPT-to-PDF conversion requires a server-side library like pptxjs.',
      'pdf-to-ppt': 'PDF-to-PPT conversion requires a server-side library.',
      'pdf-to-html': 'PDF-to-HTML conversion requires pdfjs-dist.',
    };

    const message = needsLibrary[tool];
    if (message) {
      return new NextResponse(JSON.stringify({
        success: true,
        message,
        files: [{
          name: `${baseName}-${tool.replace('pdf-to', '').replace('to-', '-')}.pdf`,
          data: buffer.toString('base64'),
        }],
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return errorResponse(`Conversion tool "${tool}" is not supported.`, 400);
  } catch (error) {
    console.error('Convert error:', error);
    return errorResponse(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}
