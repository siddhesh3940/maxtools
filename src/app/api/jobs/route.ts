import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);
    const offset = Number(searchParams.get('offset')) || 0;

    const where: Record<string, unknown> = { userId };
    if (status) where.status = status;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: { file: { select: { id: true, originalName: true, url: true } } },
      }),
      prisma.job.count({ where }),
    ]);

    return successResponse({ jobs, total, limit, offset });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return errorResponse('Failed to fetch jobs', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const body = await request.json();
    const { type, toolId, fileId, config } = body;

    if (!type) return errorResponse('Job type is required', 400);

    const job = await prisma.job.create({
      data: {
        userId,
        type,
        toolId: toolId || null,
        fileId: fileId || null,
        config: config || {},
        status: 'PENDING',
      },
    });

    return successResponse(job, 201);
  } catch (error) {
    console.error('Job create error:', error);
    return errorResponse('Failed to create job', 500);
  }
}
