import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-helpers';
import type { Prisma } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const { id } = await params;
    const workflow = await prisma.workflow.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!workflow) return notFoundResponse('Workflow');

    const steps = workflow.steps as { tool: string; config?: Record<string, unknown> }[];
    if (!steps || steps.length === 0) return errorResponse('Workflow has no steps', 400);

    const jobs = [];
    for (const step of steps) {
      const job = await prisma.job.create({
        data: {
          userId,
          type: step.tool,
          config: (step.config || {}) as Prisma.InputJsonValue,
          status: 'PENDING',
        },
      });
      jobs.push(job);
    }

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: id,
        status: 'PENDING',
      },
    });

    return successResponse({ execution, jobs }, 201);
  } catch (error) {
    console.error('Workflow execute error:', error);
    return errorResponse('Failed to execute workflow', 500);
  }
}
