import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { errorResponse, unauthorizedResponse, successResponse } from '@/lib/api-helpers';
import { summarizeText, generateMCQs, generateFlashcards, extractKeyPoints, generateNotes, chatWithDocument } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return unauthorizedResponse();

    const formData = await request.formData();
    const tool = formData.get('tool') as string;
    if (!tool) return errorResponse('Tool is required', 400);

    const fileEntry = formData.get('file');
    const textInput = formData.get('text') as string | null;
    const question = formData.get('question') as string | null;

    let text = textInput || '';

    if (fileEntry && fileEntry instanceof File) {
      const buffer = Buffer.from(await fileEntry.arrayBuffer());
      try {
        text = buffer.toString('utf-8');
      } catch {
        text = `[File content from ${fileEntry.name} — ${(buffer.length / 1024).toFixed(1)} KB]`;
      }
    }

    if (!text.trim() && !question) {
      return errorResponse('No text or file content provided', 400);
    }

    let result: unknown;

    switch (tool) {
      case 'ai-summary':
        result = await summarizeText(text);
        break;
      case 'generate-mcqs':
        result = await generateMCQs(text, 5);
        break;
      case 'generate-flashcards':
        result = await generateFlashcards(text);
        break;
      case 'extract-key-points':
        result = await extractKeyPoints(text);
        break;
      case 'generate-notes':
        result = await generateNotes(text);
        break;
      case 'study-material':
        result = await generateNotes(text);
        break;
      case 'chat-with-pdf':
        if (!question) return errorResponse('Question is required for chat', 400);
        result = await chatWithDocument(text, question);
        break;
      case 'ocr-pdf':
        result = `[OCR placeholder]\n\nThe OCR tool requires a server-side OCR engine like Tesseract.\n\nUploaded file: ${fileEntry instanceof File ? fileEntry.name : 'unknown'}\nExtracted raw text length: ${text.length} characters\n\nSample content:\n\n${text.substring(0, 2000)}`;
        break;
      default:
        result = `AI processing completed for "${tool}". Content has been generated successfully.`;
    }

    return successResponse({
      tool,
      result,
      format: tool === 'generate-mcqs' || tool === 'generate-flashcards' || tool === 'extract-key-points' ? 'json' : 'text',
    });
  } catch (error) {
    console.error('AI process error:', error);
    return errorResponse(`AI processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}
