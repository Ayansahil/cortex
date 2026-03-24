import { SearchRepository } from './search.repository.js';
import { Item } from '../../core/database/models/index.js';

export class SearchService {
  constructor() {
    this.searchRepository = new SearchRepository();
  }

  async semanticSearch(userId, query, limit = 10) {
    try {
      const { generateEmbedding, findSimilarItems } = await import('../../utils/embedding.util.js');
      const { Embedding } = await import('../../core/database/models/index.js');

      // 1. Generate embedding for query
      const queryVector = await generateEmbedding(query);

      if (queryVector) {
        // 2. Find all embeddings for this user
        const allEmbeddings = await Embedding.find({ user: userId }).lean();
        
        // 3. Find similar items
        const similarities = await findSimilarItems(queryVector, allEmbeddings, limit);
        
        if (similarities.length > 0) {
          const results = await this.searchRepository.findSimilarItems(userId, similarities);
          return { items: results, total: results.length, method: 'semantic' };
        }
      }

      // 4. Fallback to MongoDB regex search
      const results = await Item.find({
        user: userId,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { excerpt: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
          { 'autoTags.tag': { $regex: query, $options: 'i' } },
        ],
      })
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      return { items: results, total: results.length, method: 'regex' };
    } catch (error) {
      console.error('Error in search:', error);
      throw error;
    }
  }

  async getRelatedItems(userId, itemId, limit = 5) {
    try {
      const relations = await this.searchRepository.findRelatedItems(userId, itemId);
      return relations.slice(0, limit).map(rel => {
        const isSource = rel.sourceItem._id.toString() === itemId;
        return {
          relationType: rel.relationType,
          strength: rel.strength,
          item: isSource ? rel.targetItem : rel.sourceItem,
        };
      });
    } catch {
      return [];
    }
  }

  async getGraphData(userId) {
    return await this.searchRepository.getGraphData(userId);
  }

  async searchByTags(userId, tags, limit = 20) {
    return await this.searchRepository.findItemsByTags(userId, tags, limit);
  }
}