import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-helpers';
import { TOOL_CATEGORIES, PDF_TOOLS, CONVERSION_TOOLS, POWER_TOOLS } from '@/lib/constants';

const categoryTools: Record<string, readonly { name: string; slug: string; icon: string; description: string }[]> = {
  POWER_TOOLS: POWER_TOOLS,
  COMPRESS: PDF_TOOLS.filter(t => t.category === 'COMPRESS'),
  MERGE_SPLIT: PDF_TOOLS.filter(t => t.category === 'MERGE_SPLIT'),
  CONVERT: CONVERSION_TOOLS,
  EDIT_SIGN: PDF_TOOLS.filter(t => t.category === 'EDIT_SIGN'),
  SECURITY: PDF_TOOLS.filter(t => t.category === 'SECURITY'),
  ORGANIZE: PDF_TOOLS.filter(t => t.category === 'ORGANIZE'),
};

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const tools = TOOL_CATEGORIES.map((category) => ({
      ...category,
      tools: categoryTools[category.id] || [],
    }));

    return successResponse({ categories: tools });
  } catch (error) {
    console.error('Tools fetch error:', error);
    return errorResponse('Failed to fetch tools', 500);
  }
}
