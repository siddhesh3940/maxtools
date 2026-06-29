import type { WorkflowStep } from '@/types';

async function callProcessEndpoint(tool: string, fileIds: string[], config: Record<string, unknown>): Promise<{ outputFileIds: string[]; output: unknown }> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool, fileIds, config }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Process endpoint error (${response.status}) for tool "${tool}": ${errorBody}`);
  }

  const data = await response.json();
  return {
    outputFileIds: data.fileIds ?? [],
    output: data.result ?? {},
  };
}

export async function executeWorkflow(steps: WorkflowStep[], inputFileIds: string[]): Promise<{
  fileIds: string[];
  results: Array<{ stepId: string; tool: string; output: unknown }>;
}> {
  let currentFileIds = [...inputFileIds];
  const results: Array<{ stepId: string; tool: string; output: unknown }> = [];

  for (const step of steps) {
    const { outputFileIds, output } = await callProcessEndpoint(step.tool, currentFileIds, step.config);
    currentFileIds = outputFileIds;
    results.push({ stepId: step.id, tool: step.tool, output });
  }

  return { fileIds: currentFileIds, results };
}
