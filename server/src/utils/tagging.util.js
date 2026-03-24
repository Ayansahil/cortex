import OpenAI from 'openai';
import config from '../core/config/env.config.js';

// FIX: OpenRouter compatible — free model
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
  baseURL: config.openai.baseURL || 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://cortex-app.com',
    'X-Title': 'Cortex Second Brain',
  },
});

export const generateTags = async (title, content) => {
  try {
    if (!config.openai.apiKey) {
      // Fallback: extract keywords locally without AI
      const keywords = extractKeywords(`${title} ${content}`);
      return {
        tags: keywords.map(k => ({ tag: k, confidence: 0.6 })),
        topics: [],
      };
    }

    const text = `${title}\n\n${content}`.substring(0, 2000);

    const prompt = `Analyze the following content and provide:
1. 5-10 relevant tags (single words or short phrases)
2. 3-5 main topics with relevance scores (0-1)

Content:
${text}

Respond in JSON format only, no explanation:
{
  "tags": ["tag1", "tag2"],
  "topics": [
    {"name": "topic1", "score": 0.9}
  ]
}`;

    const response = await openai.chat.completions.create({
      // FIX: Free model on OpenRouter
      model: config.openai.model || 'google/gemma-3-27b-it:free',
      messages: [
        {
          role: 'system',
          content: 'You are a content analysis assistant. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const raw = response.choices[0].message.content.trim();
    // Strip markdown code blocks if model wraps in ```json
    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return {
      tags: (result.tags || []).map(tag => ({
        tag: tag.toLowerCase().trim(),
        confidence: 0.8,
      })),
      topics: result.topics || [],
    };
  } catch (error) {
    console.error('Error generating tags — using keyword fallback:', error.message);
    // Fallback: always return something even if AI fails
    const keywords = extractKeywords(`${title} ${content}`);
    return {
      tags: keywords.map(k => ({ tag: k, confidence: 0.5 })),
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