import { Queue, Worker, Job } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

export const pdfQueue = new Queue('pdf-processing', { connection });
export const conversionQueue = new Queue('conversion', { connection });
export const printQueue = new Queue('print-production', { connection });
export const aiQueue = new Queue('ai-processing', { connection });

export { Queue, Worker, Job } from 'bullmq';
export type { Job as JobType } from 'bullmq';

export async function addJob(queue: Queue, name: string, data: Record<string, unknown>, opts?: { delay?: number; priority?: number }) {
  return queue.add(name, data, opts);
}
