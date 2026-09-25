import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to truncate or sample text if exceptionally long (> 80k chars)
function prepareDocumentText(text: string, maxChars = 75000): string {
  if (!text) return '';
  if (text.length <= maxChars) return text;
  // If too long, grab first 50k and last 25k chars
  const half = Math.floor(maxChars * 0.65);
  const remainder = maxChars - half;
  return `${text.slice(0, half)}\n\n[... Document truncated for AI context window ...]\n\n${text.slice(-remainder)}`;
}

// 1. POST /api/summarize
app.post('/api/summarize', async (req, res) => {
  try {
    const { title, text, mode = 'standard' } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const docText = prepareDocumentText(text);

    const systemInstruction = `You are PDF.AI, an elite academic and professional document summarizer and study analyst.
Analyze the provided document and produce a structured, high-value summary formatted according to the schema.
Ensure clarity, accurate terminology, zero fluff, and highlight core concepts.`;

    const prompt = `Analyze and summarize this document titled "${title || 'Untitled Document'}":

Document Content:
"""
${docText}
"""

Summary Mode: ${mode} (if detailed, make explanations comprehensive; if short, make them high-level and punchy).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: {
              type: Type.STRING,
              description: 'Clear, balanced 2-3 paragraph executive summary of the document.',
            },
            shortSummary: {
              type: Type.STRING,
              description: 'A punchy, 2-3 sentence high-level summary.',
            },
            detailedSummary: {
              type: Type.STRING,
              description: 'In-depth markdown summary with topic headings, structured analysis, and conclusions.',
            },
            keyConcepts: {
              type: Type.ARRAY,
              description: 'List of 4 to 8 primary concepts explained in the document.',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  relevance: { type: Type.STRING },
                },
                required: ['id', 'title', 'explanation'],
              },
            },
            keyTakeaways: {
              type: Type.ARRAY,
              description: 'List of 5 to 8 crisp, bullet-point takeaways.',
              items: { type: Type.STRING },
            },
            topics: {
              type: Type.ARRAY,
              description: 'Main keywords and topic tags.',
              items: { type: Type.STRING },
            },
            estimatedReadingTimeMinutes: {
              type: Type.INTEGER,
              description: 'Estimated minutes to read original full text.',
            },
          },
          required: ['executiveSummary', 'shortSummary', 'detailedSummary', 'keyConcepts', 'keyTakeaways', 'topics'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/summarize:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate summary',
    });
  }
});

// 2. POST /api/chat
app.post('/api/chat', async (req, res) => {
  try {
    const { title, text, history = [], message, pageContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const docText = prepareDocumentText(text || '', 60000);

    const systemInstruction = `You are the AI study assistant in PDF.AI for the document titled "${title || 'Document'}".
Your responsibility is to answer the user's questions strictly based on the provided document content.
- If the question can be answered using the document, provide a direct, insightful, and clearly structured response (use markdown, bullet points, bold key terms).
- If the information is not present in the document, politely state that it is not covered in this document, but offer relevant related context if available.
- When applicable, mention which section, topic, or concept in the document explains it.
- Never make up facts. Keep the tone helpful, academic, and encouraging.`;

    // Build contents array with document context and conversational history
    const contextPrompt = `[DOCUMENT CONTEXT START]
Title: ${title || 'Document'}
${pageContext ? `Current Active Page / Section: ${pageContext}\n` : ''}
Content:
"""
${docText}
"""
[DOCUMENT CONTEXT END]

User Query: ${message}`;

    // Convert history format to Gemini format if provided
    const geminiContents: any[] = [];
    geminiContents.push({
      role: 'user',
      parts: [{ text: `Here is the reference document:\n${docText.slice(0, 45000)}` }],
    });
    geminiContents.push({
      role: 'model',
      parts: [{ text: `I have thoroughly read and indexed "${title || 'the document'}". How can I assist you with it today?` }],
    });

    // Add prior turns (keep last 6 for prompt budget)
    const recentHistory = history.slice(-6);
    for (const h of recentHistory) {
      geminiContents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      });
    }

    // Add latest query
    geminiContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: geminiContents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'I could not generate an answer for that query.';

    // Generate 3 quick suggested follow-up questions
    const followUpResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Based on this document "${title}" and the conversation so far, generate 3 short, intriguing follow-up questions the user might ask next:
User: ${message}
AI: ${reply.slice(0, 500)}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            followUps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['followUps'],
        },
      },
    });

    let followUps: string[] = [];
    try {
      const followUpData = JSON.parse(followUpResponse.text || '{}');
      if (Array.isArray(followUpData.followUps)) {
        followUps = followUpData.followUps.slice(0, 3);
      }
    } catch {
      followUps = ['Explain this with an analogy', 'Give me a real-world example', 'What are potential exam questions on this?'];
    }

    return res.json({
      reply,
      suggestedQuestions: followUps,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({ error: error.message || 'Chat query failed' });
  }
});

// 3. POST /api/exam-questions
app.post('/api/exam-questions', async (req, res) => {
  try {
    const { title, text, questionType = 'mixed', count = 6, difficulty = 'medium' } = req.body;
    const docText = prepareDocumentText(text || '');

    const prompt = `Generate exam questions based on the following document:
Title: "${title || 'Study Material'}"
Question Type: ${questionType} (Options: 3_mark, 5_mark, 9_mark, mcq, mixed)
Target Count: ${count}
Difficulty: ${difficulty}

Document Content:
"""
${docText}
"""

Requirements:
- For 3 Mark Questions: Short definitions, direct concepts, concise answer points (2-3 sentences).
- For 5 Mark Questions: Explanations, comparisons, architectural/flow summaries with 4-5 key points.
- For 9 Mark Questions: Comprehensive essay/in-depth questions requiring detailed step-by-step breakdown, subheadings, and complete explanations.
- For MCQ: 4 options with exact correct option letter/text and a clear explanation.
- Set realistic academic marks and provide a thorough model answer and key scoring criteria.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an experienced university professor creating official examination question banks and grading rubrics.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING, description: '3 Mark, 5 Mark, 9 Mark, or MCQ' },
                  marks: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Required only for MCQ, otherwise empty',
                  },
                  correctAnswer: { type: Type.STRING, description: 'Required for MCQ' },
                  keyPointsRequired: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Key points an examiner looks for to award full marks',
                  },
                  modelAnswer: { type: Type.STRING, description: 'Full comprehensive model answer' },
                  gradingCriteria: { type: Type.STRING, description: 'Rubric for awarding marks' },
                },
                required: ['id', 'category', 'marks', 'question', 'modelAnswer'],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/exam-questions:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate exam questions' });
  }
});

// 4. POST /api/flashcards
app.post('/api/flashcards', async (req, res) => {
  try {
    const { title, text, count = 10 } = req.body;
    const docText = prepareDocumentText(text || '');

    const prompt = `Create ${count} high-yield, interactive study flashcards from this document:
Title: "${title || 'Document'}"

Document Content:
"""
${docText}
"""

Focus on core definitions, critical distinctions, key formulas/laws, and essential exam facts.
Keep questions crisp and answers clear and memorable.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert learning scientist specializing in spaced repetition and active recall flashcards.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  category: { type: Type.STRING },
                  hint: { type: Type.STRING },
                },
                required: ['id', 'question', 'answer'],
              },
            },
          },
          required: ['flashcards'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/flashcards:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate flashcards' });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PDF.AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
