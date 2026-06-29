import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, plan: true, storageUsed: true, storageLimit: true },
    });
    if (!user) return errorResponse('User not found', 404);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalJobs, recentJobs, totalFiles, activeFiles, totalWorkflows] = await Promise.all([
      prisma.job.count({ where: { userId: user.id } }),
      prisma.job.count({
        where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.file.count({ where: { userId: user.id, deletedAt: null } }),
      prisma.file.count({
        where: { userId: user.id, deletedAt: null, createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.workflow.count({ where: { userId: user.id, deletedAt: null } }),
    ]);

    const completedJobs = await prisma.job.count({
      where: { userId: user.id, status: 'COMPLETED' },
    });

    return successResponse({
      jobs: {
        total: totalJobs,
        recent: recentJobs,
        completed: completedJobs,
      },
      files: {
        total: totalFiles,
        recent: activeFiles,
      },
      workflows: totalWorkflows,
      storage: {
        used: Number(user.storageUsed),
        limit: Number(user.storageLimit),
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return errorResponse('Failed to fetch stats', 500);
  }
}
