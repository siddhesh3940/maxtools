const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callOpenAI(messages: ChatMessage[], options?: { model?: string; temperature?: number; maxTokens?: number }): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options?.model ?? DEFAULT_MODEL,
      messages,
      temperature: options?.temperature ?? 0.3,
      max_tokens: options?.maxTokens ?? 4096,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

export async function summarizeText(text: string): Promise<string> {
  if (!text.trim()) return '';
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return 'AI summary is not available. Please configure your OpenAI API key.';

  try {
    return await callOpenAI([
      { role: 'system', content: 'You are a document summarization assistant. Provide a concise, well-structured summary of the given text. Include key points and main ideas.' },
      { role: 'user', content: `Please summarize the following text:\n\n${text.slice(0, 50000)}` },
    ]);
  } catch (error) {
    console.error('summarizeText error:', error);
    return 'Unable to generate summary at this time. Please try again later.';
  }
}

export async function generateMCQs(text: string, count: number): Promise<Array<{ question: string; options: string[]; answer: string }>> {
  if (!text.trim()) return [];
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return [];

  try {
    const content = await callOpenAI([
      { role: 'system', content: 'You are an educational assistant. Generate multiple choice questions based on the provided text. Return ONLY valid JSON array without markdown formatting.' },
      { role: 'user', content: `Generate ${count} multiple choice questions based on this text. Each question must have 4 options and the correct answer. Return as JSON array: [{ "question": "...", "options": ["A", "B", "C", "D"], "answer": "A" }]\n\nText:\n${text.slice(0, 50000)}` },
    ]);

    const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, count).map((item: { question?: string; options?: string[]; answer?: string }) => ({
      question: item.question ?? '',
      options: Array.isArray(item.options) ? item.options : [],
      answer: item.answer ?? '',
    }));
  } catch (error) {
    console.error('generateMCQs error:', error);
    return [];
  }
}

export async function generateFlashcards(text: string): Promise<Array<{ front: string; back: string }>> {
  if (!text.trim()) return [];
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return [];

  try {
    const content = await callOpenAI([
      { role: 'system', content: 'You are an educational assistant. Create flashcards from the provided text. Return ONLY valid JSON array without markdown formatting.' },
      { role: 'user', content: `Generate flashcards from this text. Each flashcard has a front (concept/question) and back (definition/answer). Return as JSON array: [{ "front": "Concept", "back": "Definition" }]\n\nText:\n${text.slice(0, 50000)}` },
    ]);

    const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: { front?: string; back?: string }) => ({
      front: item.front ?? '',
      back: item.back ?? '',
    }));
  } catch (error) {
    console.error('generateFlashcards error:', error);
    return [];
  }
}

export async function extractKeyPoints(text: string): Promise<string[]> {
  if (!text.trim()) return [];
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return [];

  try {
    const content = await callOpenAI([
      { role: 'system', content: 'You are an analytical assistant. Extract key points and important information from the provided text. Return ONLY a JSON array of strings without markdown formatting.' },
      { role: 'user', content: `Extract the key points from this text. Return as JSON array of strings: ["point 1", "point 2", ...]\n\nText:\n${text.slice(0, 50000)}` },
    ]);

    const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p: unknown): p is string => typeof p === 'string');
  } catch (error) {
    console.error('extractKeyPoints error:', error);
    return [];
  }
}

export async function generateNotes(text: string): Promise<string> {
  if (!text.trim()) return '';
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return 'AI notes generation is not available. Please configure your OpenAI API key.';

  try {
    return await callOpenAI([
      { role: 'system', content: 'You are a study notes assistant. Transform the provided text into well-organized study notes with headings, bullet points, and key concepts highlighted.' },
      { role: 'user', content: `Generate comprehensive study notes from this text:\n\n${text.slice(0, 50000)}` },
    ]);
  } catch (error) {
    console.error('generateNotes error:', error);
    return 'Unable to generate notes at this time. Please try again later.';
  }
}

export async function chatWithDocument(
  text: string,
  question: string,
  history?: Array<{ role: string; content: string }>
): Promise<string> {
  if (!text.trim() || !question.trim()) return '';
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return 'AI chat is not available. Please configure your OpenAI API key.';

  try {
    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are a document analysis assistant. Answer questions based solely on the provided document content. If the answer cannot be found in the document, say so.' },
      { role: 'user', content: `Document content:\n\n${text.slice(0, 50000)}` },
    ];

    if (history && history.length > 0) {
      const validRoles = new Set(['user', 'assistant']);
      for (const entry of history.slice(-10)) {
        if (entry.role === 'system') continue;
        messages.push({
          role: validRoles.has(entry.role) ? entry.role as 'user' | 'assistant' : 'user',
          content: entry.content,
        });
      }
    }

    messages.push({ role: 'user', content: question });

    return await callOpenAI(messages, { temperature: 0.1 });
  } catch (error) {
    console.error('chatWithDocument error:', error);
    return 'Unable to process your question at this time. Please try again later.';
  }
}
