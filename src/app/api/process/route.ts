import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const body = await request.json();
    const { tool, fileId, config } = body;

    if (!tool) return errorResponse('Tool slug is required', 400);
    if (!fileId) return errorResponse('File ID is required', 400);

    const file = await prisma.file.findFirst({
      where: { id: fileId, userId, deletedAt: null },
    });
    if (!file) return errorResponse('File not found', 404);

    const job = await prisma.job.create({
      data: {
        userId,
        type: tool,
        fileId,
        config: config || {},
        status: 'PENDING',
      },
    });

    return successResponse({ job, file }, 201);
  } catch (error) {
    console.error('Process error:', error);
    return errorResponse('Failed to process request', 500);
  }
}
