import { Worker, Job } from 'bullmq';
import { PDFDocument } from 'pdf-lib';
import prisma from '@/lib/db';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

async function processCutAndStack(job: Job, fileBytes: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(fileBytes);
  const totalPages = pdfDoc.getPageCount();
  const rows = (job.data.rows as number) || 2;
  const cols = (job.data.columns as number) || 2;
  const pagesPerSheet = rows * cols;
  const totalSheets = Math.ceil(totalPages / (pagesPerSheet * 2)) * 2;
  const newPdf = await PDFDocument.create();

  for (let sheet = 0; sheet < totalSheets; sheet++) {
    const newPage = newPdf.addPage();
    const { width, height } = pdfDoc.getPage(0).getSize();
    newPage.setSize(width * cols, height * rows);
  }

  return Buffer.from(await newPdf.save());
}

async function processBooklet(job: Job, fileBytes: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(fileBytes);
  const totalPages = pdfDoc.getPageCount();
  const newPdf = await PDFDocument.create();

  const signatures = Math.ceil(totalPages / 4);
  for (let s = 0; s < signatures; s++) {
    const start = s * 4;
    const end = Math.min(start + 4, totalPages);
    for (let i = start; i < end; i++) {
      const [page] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(page);
    }
  }

  return Buffer.from(await newPdf.save());
}

async function processNup(job: Job, fileBytes: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(fileBytes);
  const pagesPerSheet = (job.data.pagesPerSheet as number) || 2;
  const newPdf = await PDFDocument.create();
  const totalPages = pdfDoc.getPageCount();

  for (let i = 0; i < totalPages; i += pagesPerSheet) {
    const newPage = newPdf.addPage();
    const { width, height } = pdfDoc.getPage(0).getSize();
    const cols = Math.ceil(Math.sqrt(pagesPerSheet));
    const rows = Math.ceil(pagesPerSheet / cols);
    newPage.setSize(width * cols, height * rows);
  }

  return Buffer.from(await newPdf.save());
}

const processorMap: Record<string, (job: Job, buffer: Buffer) => Promise<Buffer>> = {
  'cut-and-stack': processCutAndStack,
  booklet: processBooklet,
  'n-up': processNup,
};

export function createPrintWorker() {
  const worker = new Worker(
    'print-production',
    async (job: Job) => {
      const dbJob = await prisma.job.findUnique({ where: { id: job.data.jobId as string } });
      if (!dbJob) throw new Error(`Job ${job.data.jobId} not found in database`);

      await prisma.job.update({
        where: { id: dbJob.id },
        data: { status: 'PROCESSING', progress: 0, startedAt: new Date() },
      });

      const processor = processorMap[job.name];
      if (!processor) throw new Error(`Unknown print job type: ${job.name}`);

      await job.updateProgress(20);
      const fileRecord = dbJob.fileId
        ? await prisma.file.findUnique({ where: { id: dbJob.fileId } })
        : null;

      const fileBytes = fileRecord
        ? Buffer.from(fileRecord.path, 'base64')
        : Buffer.from('');

      await job.updateProgress(50);
      const result = await processor(job, fileBytes);
      await job.updateProgress(80);

      await prisma.job.update({
        where: { id: dbJob.id },
        data: {
          status: 'COMPLETED',
          progress: 100,
          completedAt: new Date(),
          result: { outputSize: result.length },
        },
      });

      await job.updateProgress(100);
      return { outputSize: result.length };
    },
    { connection, concurrency: 2 }
  );

  worker.on('failed', async (job: Job | undefined, err: Error) => {
    if (!job) return;
    try {
      await prisma.job.update({
        where: { id: job.data.jobId as string },
        data: { status: 'FAILED', error: err.message },
      });
    } catch {
      console.error('Failed to update print job status:', err.message);
    }
  });

  return worker;
}
