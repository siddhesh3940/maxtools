import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-helpers';
import { PDF_TOOLS, CONVERSION_TOOLS, POWER_TOOLS, TOOL_CATEGORIES } from '@/lib/constants';

const allTools = [
  ...POWER_TOOLS.map((t) => ({ ...t, category: 'POWER_TOOLS' as const })),
  ...PDF_TOOLS.map((t) => ({ ...t, category: t.category })),
  ...CONVERSION_TOOLS.map((t) => ({ ...t, category: 'CONVERT' as const })),
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const { slug } = await params;
    const tool = allTools.find((t) => t.slug === slug);
    if (!tool) return notFoundResponse('Tool');

    const category = TOOL_CATEGORIES.find((c) => c.id === tool.category);

    return successResponse({ ...tool, categoryInfo: category || null });
  } catch (error) {
    console.error('Tool fetch error:', error);
    return errorResponse('Failed to fetch tool', 500);
  }
}
