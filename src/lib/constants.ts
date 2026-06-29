export const APP_NAME = 'MaxTools';
export const APP_TAGLINE = 'One Toolkit. Unlimited Possibilities.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const PRIMARY_COLOR = '#2563EB';
export const SECONDARY_COLOR = '#7C3AED';

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_FREE_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_BATCH = 100;

export const ALLOWED_PDF_TYPES = ['application/pdf'];
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];
export const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/html'];

export const STORAGE_LIMITS = {
  FREE: 100 * 1024 * 1024, // 100MB
  PRO: 1024 * 1024 * 1024, // 1GB
  BUSINESS: 10 * 1024 * 1024 * 1024, // 10GB
  ENTERPRISE: 100 * 1024 * 1024 * 1024, // 100GB
} as const;

export const FILE_RETENTION_DAYS = 7;
export const FILE_RETENTION_DAYS_PRO = 30;

export const TOOL_CATEGORIES = [
  { id: 'PDF', name: 'PDF Tools', icon: 'FileText', description: 'Merge, split, compress, and edit PDFs' },
  { id: 'CONVERSION', name: 'Conversion', icon: 'FileType', description: 'Convert between formats' },
  { id: 'IMAGE', name: 'Image Tools', icon: 'Image', description: 'Edit and optimize images' },
  { id: 'AI', name: 'AI Tools', icon: 'Wand2', description: 'AI-powered document processing' },
  { id: 'PRINT', name: 'Print Production', icon: 'Printer', description: 'Professional print solutions' },
  { id: 'WORKFLOW', name: 'Workflow', icon: 'Workflow', description: 'Automate repetitive tasks' },
] as const;

export const PDF_TOOLS = [
  { name: 'Merge PDF', slug: 'merge-pdf', icon: 'Combine', description: 'Combine multiple PDFs into one' },
  { name: 'Split PDF', slug: 'split-pdf', icon: 'Split', description: 'Split PDF into separate files' },
  { name: 'Compress PDF', slug: 'compress-pdf', icon: 'FileDown', description: 'Reduce PDF file size' },
  { name: 'Rotate PDF', slug: 'rotate-pdf', icon: 'RotateCw', description: 'Rotate PDF pages' },
  { name: 'Reorder Pages', slug: 'reorder-pages', icon: 'ArrowUpDown', description: 'Rearrange page order' },
  { name: 'Delete Pages', slug: 'delete-pages', icon: 'Trash2', description: 'Remove unwanted pages' },
  { name: 'Extract Pages', slug: 'extract-pages', icon: 'FileOutput', description: 'Extract specific pages' },
  { name: 'Watermark PDF', slug: 'watermark-pdf', icon: 'Droplets', description: 'Add watermarks to PDF' },
  { name: 'Protect PDF', slug: 'protect-pdf', icon: 'Lock', description: 'Password protect PDF' },
  { name: 'Unlock PDF', slug: 'unlock-pdf', icon: 'Unlock', description: 'Remove PDF password' },
  { name: 'Sign PDF', slug: 'sign-pdf', icon: 'PenLine', description: 'Add digital signatures' },
  { name: 'Flatten PDF', slug: 'flatten-pdf', icon: 'FlipHorizontal', description: 'Flatten PDF layers' },
  { name: 'Compare PDFs', slug: 'compare-pdfs', icon: 'FileSearch', description: 'Compare two PDFs' },
  { name: 'Repair PDF', slug: 'repair-pdf', icon: 'Wrench', description: 'Repair corrupted PDFs' },
] as const;

export const CONVERSION_TOOLS = [
  { name: 'PDF to Word', slug: 'pdf-to-word', icon: 'FileText', description: 'Convert PDF to DOCX' },
  { name: 'Word to PDF', slug: 'word-to-pdf', icon: 'FileText', description: 'Convert DOCX to PDF' },
  { name: 'PDF to JPG', slug: 'pdf-to-jpg', icon: 'Image', description: 'Convert PDF pages to JPG' },
  { name: 'JPG to PDF', slug: 'jpg-to-pdf', icon: 'FileImage', description: 'Convert JPG images to PDF' },
  { name: 'PDF to PNG', slug: 'pdf-to-png', icon: 'Image', description: 'Convert PDF to PNG images' },
  { name: 'PNG to PDF', slug: 'png-to-pdf', icon: 'FileImage', description: 'Convert PNG to PDF' },
  { name: 'Excel to PDF', slug: 'excel-to-pdf', icon: 'FileSpreadsheet', description: 'Convert XLSX to PDF' },
  { name: 'PDF to Excel', slug: 'pdf-to-excel', icon: 'FileSpreadsheet', description: 'Convert PDF to XLSX' },
  { name: 'PPT to PDF', slug: 'ppt-to-pdf', icon: 'Presentation', description: 'Convert PPTX to PDF' },
  { name: 'PDF to PPT', slug: 'pdf-to-ppt', icon: 'Presentation', description: 'Convert PDF to PPTX' },
  { name: 'HTML to PDF', slug: 'html-to-pdf', icon: 'Code', description: 'Convert HTML to PDF' },
  { name: 'PDF to HTML', slug: 'pdf-to-html', icon: 'Code', description: 'Convert PDF to HTML' },
] as const;

export const IMAGE_TOOLS = [
  { name: 'Resize Image', slug: 'resize-image', icon: 'Maximize', description: 'Resize images' },
  { name: 'Compress Image', slug: 'compress-image', icon: 'FileDown', description: 'Reduce image size' },
  { name: 'Crop Image', slug: 'crop-image', icon: 'Crop', description: 'Crop images' },
  { name: 'Convert Image', slug: 'convert-image', icon: 'RefreshCw', description: 'Convert image formats' },
  { name: 'Watermark Image', slug: 'watermark-image', icon: 'Droplets', description: 'Add watermark to images' },
  { name: 'Remove Background', slug: 'remove-background', icon: 'Wand2', description: 'AI background removal' },
  { name: 'Image Upscaler', slug: 'image-upscaler', icon: 'ZoomIn', description: 'AI image upscaling' },
] as const;

export const AI_TOOLS = [
  { name: 'OCR PDF', slug: 'ocr-pdf', icon: 'ScanText', description: 'Extract text from scanned PDFs' },
  { name: 'AI PDF Summary', slug: 'ai-summary', icon: 'FileText', description: 'Summarize PDF documents' },
  { name: 'Chat with PDF', slug: 'chat-with-pdf', icon: 'MessageSquare', description: 'Ask questions about your PDF' },
  { name: 'Generate Notes', slug: 'generate-notes', icon: 'StickyNote', description: 'Generate study notes' },
  { name: 'Generate MCQs', slug: 'generate-mcqs', icon: 'HelpCircle', description: 'Generate multiple choice questions' },
  { name: 'Generate Flashcards', slug: 'generate-flashcards', icon: 'Layers', description: 'Create flashcards from content' },
  { name: 'Extract Key Points', slug: 'extract-key-points', icon: 'ListChecks', description: 'Extract key information' },
  { name: 'Generate Study Material', slug: 'study-material', icon: 'BookOpen', description: 'Generate comprehensive study material' },
] as const;

export const PRINT_TOOLS = [
  { name: 'N-Up Printing', slug: 'n-up', icon: 'Grid3x3', description: 'Print multiple pages per sheet' },
  { name: 'Booklet Maker', slug: 'booklet', icon: 'BookOpen', description: 'Create booklets from PDFs' },
  { name: 'Cut & Stack', slug: 'cut-and-stack', icon: 'Scissors', description: 'Double-sided cut-and-stack imposition' },
  { name: 'Signature Imposition', slug: 'signature', icon: 'BookCopy', description: 'Create print signatures' },
  { name: 'Saddle Stitch', slug: 'saddle-stitch', icon: 'Bookmark', description: 'Saddle stitch layout' },
  { name: 'Perfect Binding', slug: 'perfect-binding', icon: 'Book', description: 'Perfect binding layout' },
  { name: 'Crop Marks', slug: 'crop-marks', icon: 'Crop', description: 'Add crop marks to pages' },
  { name: 'Registration Marks', slug: 'registration-marks', icon: 'Target', description: 'Add registration marks' },
  { name: 'Batch Print', slug: 'batch-print', icon: 'Printer', description: 'Optimize batch printing' },
] as const;
