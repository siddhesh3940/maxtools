import { createPdfWorker } from './pdf-worker';
import { createPrintWorker } from './print-worker';

let pdfWorker: ReturnType<typeof createPdfWorker> | null = null;
let printWorker: ReturnType<typeof createPrintWorker> | null = null;

export function startWorkers() {
  if (pdfWorker) return { pdfWorker, printWorker };

  pdfWorker = createPdfWorker();
  printWorker = createPrintWorker();

  console.log('Workers started: pdf-processing, print-production');

  return { pdfWorker, printWorker };
}

export function stopWorkers() {
  if (pdfWorker) {
    pdfWorker.close();
    pdfWorker = null;
  }
  if (printWorker) {
    printWorker.close();
    printWorker = null;
  }
  console.log('All workers stopped');
}

export { createPdfWorker } from './pdf-worker';
export { createPrintWorker } from './print-worker';
