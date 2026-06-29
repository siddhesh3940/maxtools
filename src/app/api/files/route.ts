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
    const mimeType = searchParams.get('mimeType');

    const where: Record<string, unknown> = { userId, deletedAt: null };
    if (mimeType) where.mimeType = { startsWith: mimeType };

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.file.count({ where }),
    ]);

    return successResponse({ files, total, limit, offset });
  } catch (error) {
    console.error('Files fetch error:', error);
    return errorResponse('Failed to fetch files', 500);
  }
}
