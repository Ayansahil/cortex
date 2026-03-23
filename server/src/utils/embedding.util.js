import OpenAI from 'openai';
import config from '../core/config/env.config.js';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export const generateEmbedding = async (text) => {
  try {
    if (!config.openai.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await openai.embeddings.create({
      model: config.openai.embeddingModel,
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

export const cosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
};

export const findSimilarItems = async (queryVector, allEmbeddings, topK = 10) => {
  const similarities = allEmbeddings.map(embedding => ({
    itemId: embedding.item,
    similarity: cosineSimilarity(queryVector, embedding.vector),
  }));

  similarities.sort((a, b) => b.similarity - a.similarity);

  return similarities.slice(0, topK);
};
