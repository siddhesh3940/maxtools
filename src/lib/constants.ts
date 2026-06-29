export const APP_NAME = 'MaxTools';
export const APP_TAGLINE = 'One Toolkit. Unlimited Possibilities.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const PRIMARY_COLOR = '#2563EB';
export const SECONDARY_COLOR = '#7C3AED';

export const MAX_FILE_SIZE = 100 * 1024 * 1024;
export const MAX_FREE_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_FILES_BATCH = 100;

export const ALLOWED_PDF_TYPES = ['application/pdf'];
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];
export const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/html'];

export const STORAGE_LIMITS = {
  FREE: 100 * 1024 * 1024,
  PRO: 1024 * 1024 * 1024,
  BUSINESS: 10 * 1024 * 1024 * 1024,
  ENTERPRISE: 100 * 1024 * 1024 * 1024,
} as const;

export const FILE_RETENTION_DAYS = 7;
export const FILE_RETENTION_DAYS_PRO = 30;

export const TOOL_CATEGORIES = [
  { id: 'POWER_TOOLS', name: 'Power Tools', icon: 'Zap', description: 'Advanced multi-file tools' },
  { id: 'COMPRESS', name: 'Compress', icon: 'FileDown', description: 'Reduce file sizes' },
  { id: 'MERGE_SPLIT', name: 'Merge & Split', icon: 'Combine', description: 'Combine and split documents' },
  { id: 'CONVERT', name: 'Convert', icon: 'RefreshCw', description: 'Convert between formats' },
  { id: 'EDIT_SIGN', name: 'Edit & Sign', icon: 'PenLine', description: 'Edit and sign documents' },
  { id: 'SECURITY', name: 'Security', icon: 'Lock', description: 'Protect and unlock documents' },
  { id: 'ORGANIZE', name: 'Organize', icon: 'Layers', description: 'Organize and repair documents' },
] as const;

export const PDF_TOOLS = [
  { name: 'Compress PDF', slug: 'compress-pdf', icon: 'FileDown', description: 'Reduce PDF file size', category: 'COMPRESS' },
  { name: 'Merge PDF', slug: 'merge-pdf', icon: 'Combine', description: 'Combine multiple PDFs into one', category: 'MERGE_SPLIT' },
  { name: 'Split PDF', slug: 'split-pdf', icon: 'Split', description: 'Split PDF into separate files', category: 'MERGE_SPLIT' },
  { name: 'Sign PDF', slug: 'sign-pdf', icon: 'PenLine', description: 'Add digital signatures', category: 'EDIT_SIGN' },
  { name: 'Watermark PDF', slug: 'watermark-pdf', icon: 'Droplets', description: 'Add watermarks to PDF', category: 'EDIT_SIGN' },
  { name: 'Unlock PDF', slug: 'unlock-pdf', icon: 'Unlock', description: 'Remove PDF password', category: 'SECURITY' },
  { name: 'Protect PDF', slug: 'protect-pdf', icon: 'Lock', description: 'Password protect PDF', category: 'SECURITY' },
  { name: 'Organize PDF', slug: 'organize-pdf', icon: 'Layers', description: 'Rearrange, delete, or extract pages', category: 'ORGANIZE' },
  { name: 'Rotate PDF', slug: 'rotate-pdf', icon: 'RotateCw', description: 'Rotate PDF pages', category: 'ORGANIZE' },
  { name: 'Repair PDF', slug: 'repair-pdf', icon: 'Wrench', description: 'Repair corrupted PDFs', category: 'ORGANIZE' },
] as const;

export const CONVERSION_TOOLS = [
  { name: 'Images to PDF', slug: 'images-to-pdf', icon: 'FileImage', description: 'Convert JPG/PNG images to PDF', category: 'CONVERT' },
] as const;

export const PRINT_TOOLS = [
  { name: 'Booklet Optimizer', slug: 'booklet-optimizer', icon: 'BookOpen', description: 'Optimize booklets for printing', category: 'POWER_TOOLS' },
  { name: 'Smart Print Mode', slug: 'smart-print', icon: 'Printer', description: 'Intelligent print layout optimization', category: 'POWER_TOOLS' },
] as const;

export const POWER_TOOLS = [
  { name: 'Booklet Optimizer', slug: 'booklet-optimizer', icon: 'BookOpen', description: 'Optimize booklets for printing', category: 'POWER_TOOLS' },
  { name: 'Workflow Builder', slug: 'workflow-builder', icon: 'Workflow', description: 'Build automated workflows', category: 'POWER_TOOLS' },
  { name: 'Batch Processing', slug: 'batch-processing', icon: 'Layers', description: 'Process multiple files at once', category: 'POWER_TOOLS' },
  { name: 'Smart Print Mode', slug: 'smart-print', icon: 'Printer', description: 'Intelligent print layout optimization', category: 'POWER_TOOLS' },
] as const;
