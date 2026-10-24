import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));

// Server-side Gemini initialization
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Step-by-step concept visual explanation endpoint
app.post('/api/ai/explain', async (req, res) => {
  const { topic, subject, codeSnippet, question } = req.body;

  if (!aiClient) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server.',
    });
  }

  try {
    const prompt = `
You are the lead AI Visual Tutor for Visora, an interactive learning platform that teaches programming and engineering mathematics through visual mental models, diagrams, and step-by-step state changes instead of dry text.

Subject: ${subject || 'Programming'}
Topic: ${topic || 'Core Concept'}
${codeSnippet ? `Code / Formula Context:\n\`\`\`\n${codeSnippet}\n\`\`\`\n` : ''}
Student Question / Focus: ${question || 'Explain this step by step with clear visual mental models.'}

Please respond with a well-structured JSON object following this format:
{
  "title": "Clear engaging topic title",
  "summary": "1-2 sentence visual summary (no walls of text)",
  "mentalModel": "A memorable real-world analogy or visual blueprint",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "visualDescription": "Detailed visual description of what happens to memory, registers, stack/heap, or coordinates",
      "codeHighlight": "optional line or expression",
      "stateChanges": { "varName": "new value" },
      "explanation": "Clear, concise explanation of this step"
    }
  ],
  "visualAsciiDiagram": "An ASCII or box-drawing diagram illustrating the pointers, memory boxes, tree, or matrix transform",
  "commonGotchas": ["gotcha 1 with visual tip", "gotcha 2"],
  "proTip": "An engineering intuition tip"
}

Make sure to return valid JSON only. Do not enclose in markdown codeblocks if possible, or use standard JSON.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating AI explanation:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate visual explanation',
    });
  }
});

// Code execution frames generator for the Visualizer
app.post('/api/ai/visualize-code', async (req, res) => {
  const { code, language } = req.body;

  if (!aiClient) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server.',
    });
  }

  try {
    const prompt = `
Analyze the following ${language || 'code'} snippet and produce a step-by-step execution simulation trace suitable for a visual debugger memory visualizer.

Code:
\`\`\`${language}
${code}
\`\`\`

Return a JSON array of execution steps (max 12 steps).
Schema:
{
  "totalSteps": number,
  "frames": [
    {
      "step": number,
      "line": number, // 1-based line of code being executed
      "action": "Description of the operation (e.g., 'Allocating int pointer on heap', 'Incrementing counter i')",
      "variables": [
        { "name": "i", "value": "0", "type": "int", "changed": true }
      ],
      "memory": {
        "stack": [
          { "frame": "main()", "slots": [{ "name": "ptr", "address": "0x7ffd4a", "value": "0x1a40" }] }
        ],
        "heap": [
          { "address": "0x1a40", "value": "[10, 20, 30]", "label": "malloc(3 * sizeof(int))" }
        ]
      },
      "stdout": "Program output so far or empty string",
      "visualTip": "Visual takeaway for this step"
    }
  ]
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating code visualization frames:', error);
    return res.status(500).json({
      error: error.message || 'Failed to simulate execution trace',
    });
  }
});

// Dynamic AI visual quiz generator
app.post('/api/ai/quiz', async (req, res) => {
  const { subject, weakTopics, count } = req.body;

  if (!aiClient) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server.',
    });
  }

  try {
    const prompt = `
Generate ${count || 3} visual-oriented multiple choice quiz questions for ${subject || 'Programming/Math'}.
Focus on these topics: ${weakTopics && weakTopics.length > 0 ? weakTopics.join(', ') : 'core foundational difficult concepts'}.

Questions MUST focus on visual reasoning (memory layouts, pointer dereferencing, recursion trees, matrix coordinate shifts, wave harmonics, or algorithmic state transitions).

Return JSON array of:
{
  "questions": [
    {
      "id": "q1",
      "topic": "Pointers & Memory",
      "question": "What will memory address 0x7fff contain after...",
      "codeSnippet": "int a = 10; int *p = &a; *p += 5;",
      "diagram": "ASCII box diagram if helpful",
      "options": ["10", "15", "0x7fff", "Segmentation Fault"],
      "correctIndex": 1,
      "visualExplanation": "Step-by-step visual trace showing dereferencing."
    }
  ]
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{"questions":[]}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate visual quiz',
    });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Visora server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
