import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const { id } = await params;
    const workflow = await prisma.workflow.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        executions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!workflow) return notFoundResponse('Workflow');
    return successResponse(workflow);
  } catch (error) {
    console.error('Workflow fetch error:', error);
    return errorResponse('Failed to fetch workflow', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const { id } = await params;
    const existing = await prisma.workflow.findFirst({ where: { id, userId, deletedAt: null } });
    if (!existing) return notFoundResponse('Workflow');

    const body = await request.json();
    const { name, description, steps, isTemplate, isScheduled, schedule } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (steps !== undefined) updateData.steps = steps;
    if (isTemplate !== undefined) updateData.isTemplate = isTemplate;
    if (isScheduled !== undefined) updateData.isScheduled = isScheduled;
    if (schedule !== undefined) updateData.schedule = schedule;

    const workflow = await prisma.workflow.update({
      where: { id },
      data: updateData,
    });

    return successResponse(workflow);
  } catch (error) {
    console.error('Workflow update error:', error);
    return errorResponse('Failed to update workflow', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const { id } = await params;
    const existing = await prisma.workflow.findFirst({ where: { id, userId, deletedAt: null } });
    if (!existing) return notFoundResponse('Workflow');

    const workflow = await prisma.workflow.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return successResponse(workflow);
  } catch (error) {
    console.error('Workflow delete error:', error);
    return errorResponse('Failed to delete workflow', 500);
  }
}
