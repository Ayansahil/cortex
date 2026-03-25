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
    const clean = raw.replace(/```json|```/g, '').trim();
    
    let result;
    try {
      result = JSON.parse(clean);
    } catch (e) {
      console.warn('DEBUG: Failed to parse AI response as JSON:', clean);
      throw new Error('Invalid JSON from AI');
    }

    // Normalization logic
    let rawTags = [];
    if (Array.isArray(result)) {
      rawTags = result; // AI returned [ {tag, confidence}, ... ]
    } else if (result.tags && Array.isArray(result.tags)) {
      rawTags = result.tags; // AI returned { tags: [...], topics: [...] }
    }

    const autoTags = [];
    const tagsSet = new Set();

    rawTags.forEach(item => {
      let t = '';
      let confidence = 0.8;

      if (typeof item === 'string') {
        t = item.toLowerCase().trim();
      } else if (typeof item === 'object' && item !== null && item.tag) {
        t = item.tag.toLowerCase().trim();
        confidence = item.confidence || 0.7;
      }

      if (t && !tagsSet.has(t)) {
        autoTags.push({ tag: t, confidence });
        tagsSet.add(t);
      }
    });

    console.log(`DEBUG: Processed ${autoTags.length} tags for "${title}"`);

    return {
      autoTags,
      tags: Array.from(tagsSet),
      topics: result.topics || [],
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