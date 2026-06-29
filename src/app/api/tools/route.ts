import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-helpers';
import { TOOL_CATEGORIES, PDF_TOOLS, CONVERSION_TOOLS, IMAGE_TOOLS, AI_TOOLS, PRINT_TOOLS } from '@/lib/constants';

const categoryTools: Record<string, readonly { name: string; slug: string; icon: string; description: string }[]> = {
  PDF: PDF_TOOLS,
  CONVERSION: CONVERSION_TOOLS,
  IMAGE: IMAGE_TOOLS,
  AI: AI_TOOLS,
  PRINT: PRINT_TOOLS,
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
