import { createPdfWorker } from './pdf-worker';

let pdfWorker: ReturnType<typeof createPdfWorker> | null = null;

export function startWorkers() {
  if (pdfWorker) return { pdfWorker };

  pdfWorker = createPdfWorker();

  console.log('Workers started: pdf-processing');

  return { pdfWorker };
}

export function stopWorkers() {
  if (pdfWorker) {
    pdfWorker.close();
    pdfWorker = null;
  }
  console.log('All workers stopped');
}

export { createPdfWorker } from './pdf-worker';
