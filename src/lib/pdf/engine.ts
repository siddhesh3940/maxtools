import { PDFDocument, degrees } from 'pdf-lib';

export async function mergePDFs(files: Buffer[]): Promise<Buffer> {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const pdf = await PDFDocument.load(file);
    const indices = pdf.getPageIndices();
    const pages = await mergedPdf.copyPages(pdf, indices);
    pages.forEach(page => mergedPdf.addPage(page));
  }
  return Buffer.from(await mergedPdf.save());
}

export async function splitPDF(file: Buffer, ranges?: { start: number; end: number }[]): Promise<Buffer[]> {
  const pdf = await PDFDocument.load(file);
  const totalPages = pdf.getPageCount();
  const results: Buffer[] = [];

  if (!ranges) {
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      results.push(Buffer.from(await newPdf.save()));
    }
    return results;
  }

  for (const range of ranges) {
    const newPdf = await PDFDocument.create();
    const pageIndices = Array.from({ length: range.end - range.start + 1 }, (_, i) => i + range.start - 1);
    const pages = await newPdf.copyPages(pdf, pageIndices);
    pages.forEach(page => newPdf.addPage(page));
    results.push(Buffer.from(await newPdf.save()));
  }

  return results;
}

export async function compressPDF(file: Buffer, _quality?: number): Promise<Buffer> {
  const pdf = await PDFDocument.load(file);
  return Buffer.from(await pdf.save({ useObjectStreams: true }));
}

export async function rotatePDFPages(file: Buffer, pages: number[], rotationDegrees: number): Promise<Buffer> {
  const pdf = await PDFDocument.load(file);
  for (const pageNum of pages) {
    const page = pdf.getPage(pageNum - 1);
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationDegrees) % 360));
  }
  return Buffer.from(await pdf.save());
}

export async function reorderPages(file: Buffer, order: number[]): Promise<Buffer> {
  const pdf = await PDFDocument.load(file);
  const newPdf = await PDFDocument.create();
  const pageIndices = order.map(p => p - 1);
  const pages = await newPdf.copyPages(pdf, pageIndices);
  pages.forEach(page => newPdf.addPage(page));
  return Buffer.from(await newPdf.save());
}

export async function deletePages(file: Buffer, pagesToDelete: number[]): Promise<Buffer> {
  const pdf = await PDFDocument.load(file);
  const sortedPages = Array.from(new Set(pagesToDelete)).sort((a, b) => b - a);
  for (const pageNum of sortedPages) {
    pdf.removePage(pageNum - 1);
  }
  return Buffer.from(await pdf.save());
}

export async function extractPages(file: Buffer, pages: number[]): Promise<Buffer> {
  const pdf = await PDFDocument.load(file);
  const newPdf = await PDFDocument.create();
  const pageIndices = pages.map(p => p - 1);
  const extractedPages = await newPdf.copyPages(pdf, pageIndices);
  extractedPages.forEach(page => newPdf.addPage(page));
  return Buffer.from(await newPdf.save());
}

export async function protectPDF(_file: Buffer, _password: string): Promise<Buffer> {
  throw new Error('PDF encryption is not supported by pdf-lib. Use a different library for password protection.');
}

export async function unlockPDF(file: Buffer, _password: string): Promise<Buffer> {
  const pdf = await PDFDocument.load(file, { ignoreEncryption: true });
  return Buffer.from(await pdf.save());
}

export async function addWatermark(file: Buffer, text: string, opacity?: number): Promise<Buffer> {
  const pdf = await PDFDocument.load(file);
  const pages = pdf.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 4,
      y: height / 2,
      size: 48,
      opacity: opacity ?? 0.2,
      rotate: degrees(45),
    });
  }
  return Buffer.from(await pdf.save());
}

export async function getPDFInfo(file: Buffer): Promise<{ pageCount: number; pages: Array<{ width: number; height: number }> }> {
  const pdf = await PDFDocument.load(file);
  const pages = pdf.getPages().map(page => {
    const { width, height } = page.getSize();
    return { width, height };
  });
  return { pageCount: pages.length, pages };
}

export async function flattenPDF(file: Buffer): Promise<Buffer> {
  const pdf = await PDFDocument.load(file);
  return Buffer.from(await pdf.save());
}

export async function signPDF(file: Buffer, signatureImage?: Buffer, signatureText?: string): Promise<Buffer> {
  const pdf = await PDFDocument.load(file);
  const pages = pdf.getPages();
  const lastPage = pages[pages.length - 1];
  const { width, height } = lastPage.getSize();

  if (signatureImage) {
    const image = await pdf.embedPng(signatureImage).catch(() => null) || await pdf.embedJpg(signatureImage).catch(() => null);
    if (image) {
      lastPage.drawImage(image, { x: width - 200, y: 50, width: 150, height: 75 });
    }
  }
  if (signatureText) {
    lastPage.drawText(signatureText, { x: width - 200, y: 130, size: 14 });
  }

  return Buffer.from(await pdf.save());
}
