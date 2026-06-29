import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);
    const offset = Number(searchParams.get('offset')) || 0;

    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.workflow.count({ where: { userId, deletedAt: null } }),
    ]);

    return successResponse({ workflows, total, limit, offset });
  } catch (error) {
    console.error('Workflows fetch error:', error);
    return errorResponse('Failed to fetch workflows', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const body = await request.json();
    const { name, description, steps, isTemplate } = body;

    if (!name) return errorResponse('Workflow name is required', 400);
    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      return errorResponse('At least one step is required', 400);
    }

    const workflow = await prisma.workflow.create({
      data: {
        userId,
        name,
        description: description || null,
        steps,
        isTemplate: isTemplate || false,
      },
    });

    return successResponse(workflow, 201);
  } catch (error) {
    console.error('Workflow create error:', error);
    return errorResponse('Failed to create workflow', 500);
  }
}
