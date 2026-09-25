import { SummaryData, ExamQuestion, Flashcard } from '../types';

export async function generateSummaryApi(
  title: string,
  text: string,
  mode: 'standard' | 'short' | 'detailed' = 'standard'
): Promise<SummaryData> {
  const res = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, text, mode }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate summary');
  }

  return await res.json();
}

export async function sendChatMessageApi(
  title: string,
  text: string,
  history: Array<{ role: 'user' | 'model'; text: string }>,
  message: string,
  pageContext?: string
): Promise<{ reply: string; suggestedQuestions: string[] }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, text, history, message, pageContext }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to send message');
  }

  return await res.json();
}

export async function generateExamQuestionsApi(
  title: string,
  text: string,
  questionType: string,
  count: number,
  difficulty: string
): Promise<{ questions: ExamQuestion[] }> {
  const res = await fetch('/api/exam-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, text, questionType, count, difficulty }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate exam questions');
  }

  return await res.json();
}

export async function generateFlashcardsApi(
  title: string,
  text: string,
  count = 8
): Promise<{ flashcards: Flashcard[] }> {
  const res = await fetch('/api/flashcards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, text, count }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate flashcards');
  }

  return await res.json();
}
