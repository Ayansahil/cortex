import { GoogleGenAI } from '@google/genai';
import config from '../core/config/env.config.js';

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateEmbedding = async (text) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log('Gemini API key missing — skipping embedding');
      return null;
    }

    const response = await genai.models.embedContent({
      model: process.env.EMBEDDING_MODEL || 'gemini-embedding-001',
      contents: text.substring(0, 2000), 
    });

    return response.embeddings[0].values;
  } catch (error) {
    console.error('Gemini embedding error:', error.message);
    return null;
  }
};

export const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  return normA && normB ? dot / (normA * normB) : 0;
};

export const findSimilarItems = async (queryVector, allEmbeddings, topK = 10) => {
  if (!queryVector) return [];
  const similarities = allEmbeddings.map(e => ({
    itemId: e.item,
    similarity: cosineSimilarity(queryVector, e.vector),
  }));
  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, topK);
};