import { Worker, Job } from 'bullmq';
import { PDFDocument, RotationTypes } from 'pdf-lib';
import prisma from '@/lib/db';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

async function processMerge(job: Job, fileBytes: Buffer): Promise<Buffer> {
  const mergedPdf = await PDFDocument.create();
  const fileIds: string[] = job.data.fileIds as string[] || [];

  for (const fileId of fileIds) {
    const fileRecord = await prisma.file.findUnique({ where: { id: fileId } });
    if (!fileRecord) continue;
    const pdfDoc = await PDFDocument.load(fileBytes);
    const indices = pdfDoc.getPageIndices();
    const pages = await mergedPdf.copyPages(pdfDoc, indices);
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  return Buffer.from(await mergedPdf.save());
}

async function processSplit(job: Job, fileBytes: Buffer): Promise<Buffer[]> {
  const pdfDoc = await PDFDocument.load(fileBytes);
  const totalPages = pdfDoc.getPageCount();
  const buffers: Buffer[] = [];

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(page);
    buffers.push(Buffer.from(await newPdf.save()));
  }

  return buffers;
}

async function processCompress(job: Job, fileBytes: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(fileBytes);
  return Buffer.from(await pdfDoc.save({ useObjectStreams: false }));
}

async function processRotate(job: Job, fileBytes: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(fileBytes);
  const degrees = (job.data.degrees as number) || 90;
  const pages = pdfDoc.getPages();
  for (const page of pages) {
      const currentAngle = page.getRotation().angle;
      page.setRotation({ type: RotationTypes.Degrees, angle: (currentAngle + degrees) % 360 });
  }
  return Buffer.from(await pdfDoc.save());
}

async function processReorder(job: Job, fileBytes: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(fileBytes);
  const order = job.data.order as number[];
  const totalPages = pdfDoc.getPageCount();
  const newPdf = await PDFDocument.create();
  const validOrder = order.filter((i) => i >= 0 && i < totalPages);
  const pages = await newPdf.copyPages(pdfDoc, validOrder);
  pages.forEach((page) => newPdf.addPage(page));
  return Buffer.from(await newPdf.save());
}

async function processDeletePages(job: Job, fileBytes: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(fileBytes);
  const pagesToDelete = new Set(job.data.pages as number[] || []);
  const indices = pdfDoc.getPageIndices().filter((i) => !pagesToDelete.has(i));
  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdfDoc, indices);
  pages.forEach((page) => newPdf.addPage(page));
  return Buffer.from(await newPdf.save());
}

async function processExtractPages(job: Job, fileBytes: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(fileBytes);
  const pagesToExtract = job.data.pages as number[] || [];
  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdfDoc, pagesToExtract);
  pages.forEach((page) => newPdf.addPage(page));
  return Buffer.from(await newPdf.save());
}

const processorMap: Record<string, (job: Job, buffer: Buffer) => Promise<Buffer | Buffer[]>> = {
  merge: processMerge,
  split: processSplit,
  compress: processCompress,
  rotate: processRotate,
  reorder: processReorder,
  'delete-pages': processDeletePages,
  'extract-pages': processExtractPages,
};

export function createPdfWorker() {
  const worker = new Worker(
    'pdf-processing',
    async (job: Job) => {
      const startTime = Date.now();
      const dbJob = await prisma.job.findUnique({ where: { id: job.data.jobId as string } });
      if (!dbJob) throw new Error(`Job ${job.data.jobId} not found in database`);

      await prisma.job.update({
        where: { id: dbJob.id },
        data: { status: 'PROCESSING', progress: 0, startedAt: new Date() },
      });

      const processor = processorMap[job.name];
      if (!processor) throw new Error(`Unknown job type: ${job.name}`);

      await job.updateProgress(10);
      const fileRecord = dbJob.fileId
        ? await prisma.file.findUnique({ where: { id: dbJob.fileId } })
        : null;

      const fileBytes = fileRecord
        ? Buffer.from(fileRecord.path, 'base64')
        : Buffer.from('');

      await job.updateProgress(30);
      const result = await processor(job, fileBytes);
      await job.updateProgress(70);

      const resultFiles = Array.isArray(result) ? result : [result];

      await prisma.job.update({
        where: { id: dbJob.id },
        data: {
          status: 'COMPLETED',
          progress: 100,
          completedAt: new Date(),
          result: {
            files: resultFiles.length,
            processingTime: Date.now() - startTime,
          },
        },
      });

      await job.updateProgress(100);
      return { files: resultFiles.length };
    },
    { connection, concurrency: 3 }
  );

  worker.on('failed', async (job: Job | undefined, err: Error) => {
    if (!job) return;
    try {
      await prisma.job.update({
        where: { id: job.data.jobId as string },
        data: { status: 'FAILED', error: err.message },
      });
    } catch {
      console.error('Failed to update job status in DB:', err.message);
    }
  });

  worker.on('completed', (job: Job) => {
    console.log(`Job ${job.id} completed successfully`);
  });

  return worker;
}
