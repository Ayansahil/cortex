import { HighlightsRepository } from './highlights.repository.js';

export class HighlightsService {
  constructor() {
    this.highlightsRepository = new HighlightsRepository();
  }

  async createHighlight(userId, highlightData) {
    const { itemId, ...rest } = highlightData;
    return await this.highlightsRepository.createHighlight({
      ...rest,
      item: itemId || highlightData.item,
      user: userId,
      position: highlightData.position || { start: 0, end: 0 },
    });
  }

  async getItemHighlights(userId, itemId) {
    return await this.highlightsRepository.findItemHighlights(itemId, userId);
  }

  async getUserHighlights(userId) {
    return await this.highlightsRepository.findUserHighlights(userId);
  }

  async getHighlightById(userId, highlightId) {
    const highlight = await this.highlightsRepository.findHighlightById(
      highlightId,
      userId
    );

    if (!highlight) {
      throw new Error('Highlight not found');
    }

    return highlight;
  }

  async updateHighlight(userId, highlightId, updateData) {
    const highlight = await this.highlightsRepository.updateHighlight(
      highlightId,
      userId,
      updateData
    );

    if (!highlight) {
      throw new Error('Highlight not found');
    }

    return highlight;
  }

  async deleteHighlight(userId, highlightId) {
    const highlight = await this.highlightsRepository.deleteHighlight(
      highlightId,
      userId
    );

    if (!highlight) {
      throw new Error('Highlight not found');
    }

    return highlight;
  }
}
