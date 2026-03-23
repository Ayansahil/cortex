import { SearchRepository } from './search.repository.js';
import { Embedding } from '../../core/database/models/index.js';
import { generateEmbedding, findSimilarItems } from '../../utils/embedding.util.js';

export class SearchService {
  constructor() {
    this.searchRepository = new SearchRepository();
  }

  async semanticSearch(userId, query, limit = 10) {
    try {
      const queryEmbedding = await generateEmbedding(query);

      const userEmbeddings = await Embedding.find({ user: userId }).lean();

      const similarities = await findSimilarItems(queryEmbedding, userEmbeddings, limit);

      const results = await this.searchRepository.findSimilarItems(userId, similarities);

      return results;
    } catch (error) {
      console.error('Error in semantic search:', error);
      throw error;
    }
  }

  async getRelatedItems(userId, itemId, limit = 5) {
    const relations = await this.searchRepository.findRelatedItems(userId, itemId);

    return relations.slice(0, limit).map(rel => {
      const isSource = rel.sourceItem._id.toString() === itemId;
      return {
        relationType: rel.relationType,
        strength: rel.strength,
        item: isSource ? rel.targetItem : rel.sourceItem,
      };
    });
  }

  async getGraphData(userId) {
    return await this.searchRepository.getGraphData(userId);
  }

  async searchByTags(userId, tags, limit = 20) {
    return await this.searchRepository.findItemsByTags(userId, tags, limit);
  }
}
