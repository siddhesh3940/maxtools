import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { errorResponse, unauthorizedResponse } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const formData = await request.formData();
    const tool = formData.get('tool') as string;
    if (!tool) return errorResponse('Tool is required', 400);

    const fileEntry = formData.get('file');
    if (!fileEntry) return errorResponse('No file provided', 400);

    const file = fileEntry instanceof File ? fileEntry : null;
    if (!file) return errorResponse('Invalid file', 400);

    const buffer = Buffer.from(await file.arrayBuffer());

    const outputFormat = (formData.get('format') as string) || file.name.split('.').pop() || 'png';
    const contentType = outputFormat === 'jpg' || outputFormat === 'jpeg' ? 'image/jpeg' :
                        outputFormat === 'webp' ? 'image/webp' :
                        outputFormat === 'tiff' ? 'image/tiff' : 'image/png';
    const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.[^.]+$/, '')}-processed.${ext}"`,
      },
    });
  } catch (error) {
    console.error('Image process error:', error);
    return errorResponse(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}
