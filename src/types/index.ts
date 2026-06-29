export type ToolCategory = 'PDF' | 'CONVERSION' | 'IMAGE' | 'AI' | 'PRINT' | 'WORKFLOW';
export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type SubscriptionPlan = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface FileInfo {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  url?: string;
  pages?: PDFPageInfo[];
}

export interface PDFPageInfo {
  pageNum: number;
  width?: number;
  height?: number;
  rotation: number;
}

export interface JobConfig {
  tool: string;
  files: string[];
  options: Record<string, unknown>;
}

export interface JobResult {
  files: Array<{ id: string; name: string; url: string }>;
  message?: string;
  stats?: Record<string, number>;
}

export interface WorkflowStep {
  id: string;
  tool: string;
  config: Record<string, unknown>;
  position: number;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  steps: WorkflowStep[];
  isTemplate?: boolean;
}

export interface CutAndStackConfig {
  rows: number;
  columns: number;
  duplex: 'long-edge' | 'short-edge';
  stackDirection: 'left-right' | 'right-left' | 'top-bottom' | 'bottom-top';
  autoPadding: boolean;
  cutMarks: boolean;
  cropMarks: boolean;
  registrationMarks: boolean;
  printInstructions: boolean;
  pageSize?: string;
}

export interface CutAndStackResult {
  frontSheets: number;
  backSheets: number;
  totalSheets: number;
  pagesPerSheet: number;
  gridCapacity: number;
  totalPages: number;
  blankPagesAdded: number;
  stacks: Array<{
    stackNum: number;
    frontPages: number[];
    backPages: number[];
  }>;
  sheets: Array<{
    sheetNum: number;
    side: 'front' | 'back';
    stackNum: number;
    pages: Array<{ row: number; col: number; pageNum: number }>;
  }>;
}

export interface BatchJob {
  id: string;
  type: string;
  files: number;
  completed: number;
  failed: number;
  status: JobStatus;
  createdAt: Date;
}

export interface AIModelConfig {
  provider: 'openai';
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AppStatistics {
  filesProcessed: number;
  activeTools: number;
  uptime: number;
  users: number;
}
