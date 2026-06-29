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
    const job = await prisma.job.findFirst({
      where: { id, userId },
      include: { file: true },
    });

    if (!job) return notFoundResponse('Job');
    return successResponse(job);
  } catch (error) {
    console.error('Job fetch error:', error);
    return errorResponse('Failed to fetch job', 500);
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
    const existing = await prisma.job.findFirst({ where: { id, userId } });
    if (!existing) return notFoundResponse('Job');

    const body = await request.json();
    const { status, progress, result, error } = body;

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (result !== undefined) updateData.result = result;
    if (error !== undefined) updateData.error = error;
    if (status === 'PROCESSING') updateData.startedAt = new Date();
    if (status === 'COMPLETED' || status === 'FAILED') updateData.completedAt = new Date();

    const job = await prisma.job.update({
      where: { id },
      data: updateData,
    });

    return successResponse(job);
  } catch (error) {
    console.error('Job update error:', error);
    return errorResponse('Failed to update job', 500);
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
    const existing = await prisma.job.findFirst({ where: { id, userId } });
    if (!existing) return notFoundResponse('Job');

    await prisma.job.delete({ where: { id } });
    return successResponse({ message: 'Job deleted' });
  } catch (error) {
    console.error('Job delete error:', error);
    return errorResponse('Failed to delete job', 500);
  }
}
