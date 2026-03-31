import OpenAI from 'openai';
import config from '../core/config/env.config.js';

// OpenRouter compatible — free model
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
  baseURL: config.openai.baseURL || 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://cortex-app.com',
    'X-Title': 'Cortex Second Brain',
  },
});

const SYSTEM_PROMPT = `You are an intelligent knowledge system.

Analyze the given content (video, pdf, article, image or link) and generate structured output for a knowledge app.

Return STRICT JSON:

{
  "summary": "short 2-3 line summary",
  "description": "well formatted explanation like notes (4-6 lines)",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "tags": ["only", "string", "tags"],
  "insight": "main takeaway from this content"
}

Rules:
- tags MUST be array of strings only
- do NOT return objects in tags
- keep summary short and clean
- description should be readable and useful
- generate meaningful insights even if input is small`;

export const generateTags = async (title, content) => {
  try {
    if (!config.openai.apiKey) {
      const keywords = extractKeywords(`${title} ${content}`);
      return {
        autoTags: keywords.map(k => ({ tag: k.toLowerCase(), confidence: 0.6 })),
        tags: keywords.map(k => k.toLowerCase()),
        topics: [],
      };
    }

    const text = `${title}\n\n${content}`.substring(0, 4000);

    const response = await openai.chat.completions.create({
      model: config.openai.model || 'google/gemma-3-27b-it:free',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Analyze this content:\n\n${text}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const raw = response.choices[0].message.content.trim();
    const clean = raw.replace(/```json|```/g, '').trim();
    
    let result;
    try {
      result = JSON.parse(clean);
    } catch (e) {
      console.warn('DEBUG: Failed to parse AI response as JSON:', clean);
      throw new Error('Invalid JSON from AI');
    }

    // Flatten tags as requested (STRICT strings only)
    const tags = Array.isArray(result.tags) 
      ? result.tags.map(t => typeof t === 'string' ? t.toLowerCase().trim() : String(t).toLowerCase()) 
      : [];

    const autoTags = tags.map(t => ({ tag: t, confidence: 0.9 }));

    return {
      autoTags,
      tags,
      summary: result.summary || '',
      analysisDescription: result.description || '',
      keyPoints: result.keyPoints || [],
      insight: result.insight || '',
      topics: [], // We are moving away from raw topics to more structured keyPoints
    };
  } catch (error) {
    console.error('Error generating tags — using keyword fallback:', error.message);
    const keywords = extractKeywords(`${title} ${content}`);
    return {
      autoTags: keywords.map(k => ({ tag: k.toLowerCase(), confidence: 0.5 })),
      tags: keywords.map(k => k.toLowerCase()),
      topics: [],
    };
  }
};

export const extractKeywords = (text, maxKeywords = 10) => {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);

  const stopWords = new Set([
    'this', 'that', 'with', 'from', 'have', 'will', 'your', 'they',
    'been', 'their', 'what', 'which', 'about', 'would', 'there', 'could',
    'http', 'https', 'www', 'html', 'com',
  ]);

  const wordCount = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
};