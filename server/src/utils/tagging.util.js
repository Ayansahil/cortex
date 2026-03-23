import OpenAI from 'openai';
import config from '../core/config/env.config.js';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export const generateTags = async (title, content) => {
  try {
    if (!config.openai.apiKey) {
      return { tags: [], topics: [] };
    }

    const text = `${title}\n\n${content}`.substring(0, 3000);

    const prompt = `Analyze the following content and provide:
1. 5-10 relevant tags (single words or short phrases)
2. 3-5 main topics with relevance scores (0-1)

Content:
${text}

Respond in JSON format:
{
  "tags": ["tag1", "tag2", ...],
  "topics": [
    {"name": "topic1", "score": 0.9},
    {"name": "topic2", "score": 0.7}
  ]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a content analysis assistant that extracts tags and topics.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      tags: result.tags.map(tag => ({
        tag: tag.toLowerCase(),
        confidence: 0.8,
      })),
      topics: result.topics,
    };
  } catch (error) {
    console.error('Error generating tags:', error);
    return { tags: [], topics: [] };
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
  ]);

  const wordCount = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  const sorted = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);

  return sorted;
};
