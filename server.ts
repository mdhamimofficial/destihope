import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSmartAssistantReply } from './src/server/smartAssistant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json({ limit: '25mb' }));

  // Initialize Gemini API client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // AI Chat Route with user control options & image vision
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history, mode = 'concise', persona = 'general', outputLang = 'bn', image } = req.body;
      if ((!message || typeof message !== 'string') && !image) {
        return res.status(400).json({ error: 'Message text or image is required' });
      }

      const contents = [];
      if (Array.isArray(history)) {
        for (const item of history) {
          contents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.content }],
          });
        }
      }

      const userParts: any[] = [];
      if (image && image.data) {
        const base64Data = image.data.includes('base64,')
          ? image.data.split('base64,')[1]
          : image.data;
        userParts.push({
          inlineData: {
            mimeType: image.mimeType || 'image/jpeg',
            data: base64Data,
          },
        });
      }
      userParts.push({
        text: message && message.trim() ? message : 'অনুগ্রহ করে এই ছবিটি মনোযোগ দিয়ে পর্যবেক্ষণ ও বিশ্লেষণ করে এর গুরুত্বপূর্ণ বিষয়গুলো বাংলায় বুঝিয়ে বলুন।',
      });

      contents.push({
        role: 'user',
        parts: userParts,
      });

      // Construct customized system prompt based on user controls
      let toneDirective = 'Keep answers crisp, direct, and actionable in bullet points.';
      if (mode === 'detailed') {
        toneDirective = 'Provide comprehensive, thorough, in-depth explanations with steps and examples.';
      } else if (mode === 'formal') {
        toneDirective = 'Use an executive, formal, and authoritative tone suitable for official correspondence.';
      } else if (mode === 'casual') {
        toneDirective = 'Use a warm, encouraging, conversational, and friendly tone.';
      }

      let personaDirective = 'You are Desti AI, a versatile and helpful assistant for the DestiHope platform.';
      if (persona === 'health') {
        personaDirective = 'You are Desti Health & Care Specialist. Focus on medical first aid, blood donation guidance, emergency triage, hospital resources, and wellbeing advice. Always advise consulting doctors for critical issues.';
      } else if (persona === 'writer') {
        personaDirective = 'You are Desti Writing & Documentation Expert. You specialize in drafting professional letters, applications, job emails, notices, and creative Bengali/English content with immaculate grammar.';
      } else if (persona === 'tutor') {
        personaDirective = 'You are Desti Study & Learning Mentor. Explain concepts simply, step-by-step, with mnemonics, study tips, and practical examples.';
      }

      let langDirective = 'Respond strictly in standard Bengali with clean formatting.';
      if (outputLang === 'en') {
        langDirective = 'Respond strictly in polished English.';
      } else if (outputLang === 'easy_bn') {
        langDirective = 'Respond in simple, colloquial, easy-to-understand Bengali (সহজ ও সাবলীল বাংলা).';
      }

      const systemInstruction = `${personaDirective} ${toneDirective} ${langDirective} Never hallucinate or give dangerous unverified medical prescriptions.`;

      let replyText = '';
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
          },
        });

        if (response && response.text) {
          replyText = response.text;
        }
      } catch (geminiError: any) {
        // Fallback gracefully without 500 status code
        replyText = generateSmartAssistantReply({
          message: message || '',
          persona,
          mode,
          outputLang,
          hasImage: !!image,
        });
      }

      if (!replyText) {
        replyText = generateSmartAssistantReply({
          message: message || '',
          persona,
          mode,
          outputLang,
          hasImage: !!image,
        });
      }

      return res.json({ reply: replyText });
    } catch (err: any) {
      const fallback = generateSmartAssistantReply({
        message: req.body?.message || '',
        persona: req.body?.persona || 'general',
        mode: req.body?.mode || 'concise',
        outputLang: req.body?.outputLang || 'bn',
        hasImage: !!req.body?.image,
      });
      return res.json({ reply: fallback });
    }
  });

  // Mount Vite in dev or static dist in production
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

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
