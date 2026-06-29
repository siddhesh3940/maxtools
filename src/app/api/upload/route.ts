import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-helpers';
import { MAX_FILE_SIZE, ALLOWED_PDF_TYPES, ALLOWED_IMAGE_TYPES, ALLOWED_DOC_TYPES } from '@/lib/constants';
import { uploadFile } from '@/lib/cloudflare/r2';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_TYPES = [...ALLOWED_PDF_TYPES, ...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return errorResponse('No file provided', 400);

    if (file.size > MAX_FILE_SIZE) return errorResponse('File exceeds maximum size', 400);
    if (!ALLOWED_TYPES.includes(file.type)) return errorResponse('File type not allowed', 400);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const storedName = `${crypto.randomUUID()}-${file.name}`;

    const url = await uploadFile(buffer, storedName, file.type);

    const fileRecord = await prisma.file.create({
      data: {
        userId,
        originalName: file.name,
        storedName,
        mimeType: file.type,
        size: file.size,
        path: storedName,
        url,
      },
    });

    return successResponse({
      id: fileRecord.id,
      name: fileRecord.originalName,
      url: fileRecord.url,
      size: fileRecord.size,
      mimeType: fileRecord.mimeType,
    }, 201);
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse('Failed to upload file', 500);
  }
}
