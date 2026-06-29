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
    const file = await prisma.file.findFirst({
      where: { id, userId, deletedAt: null },
      include: { pages: { orderBy: { pageNum: 'asc' } } },
    });

    if (!file) return notFoundResponse('File');
    return successResponse(file);
  } catch (error) {
    console.error('File fetch error:', error);
    return errorResponse('Failed to fetch file', 500);
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
    const existing = await prisma.file.findFirst({ where: { id, userId, deletedAt: null } });
    if (!existing) return notFoundResponse('File');

    const file = await prisma.file.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return successResponse(file);
  } catch (error) {
    console.error('File delete error:', error);
    return errorResponse('Failed to delete file', 500);
  }
}
