import { PDFDocument } from 'pdf-lib';

export async function convertImagesToPDF(images: Array<{ data: Buffer; format: 'png' | 'jpg' | 'webp' }>): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  for (const img of images) {
    let image;
    if (img.format === 'png') image = await pdf.embedPng(img.data);
    else if (img.format === 'jpg') image = await pdf.embedJpg(img.data);
    if (image) {
      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
  }
  return Buffer.from(await pdf.save());
}

export async function pdfToImages(_file: Buffer, _format: 'png' | 'jpg' = 'png'): Promise<Buffer[]> {
  return [Buffer.from('pdf-to-images requires pdfjs-dist with canvas rendering')];
}
