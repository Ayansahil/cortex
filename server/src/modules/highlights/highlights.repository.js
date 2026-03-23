import { Highlight } from '../../core/database/models/index.js';

export class HighlightsRepository {
  async createHighlight(highlightData) {
    const highlight = new Highlight(highlightData);
    return await highlight.save();
  }

  async findHighlightById(highlightId, userId) {
    return await Highlight.findOne({ _id: highlightId, user: userId });
  }

  async findItemHighlights(itemId, userId) {
    return await Highlight.find({ item: itemId, user: userId }).sort({ createdAt: -1 });
  }

  async findUserHighlights(userId) {
    return await Highlight.find({ user: userId })
      .populate('item', 'title url type')
      .sort({ createdAt: -1 });
  }

  async updateHighlight(highlightId, userId, updateData) {
    return await Highlight.findOneAndUpdate(
      { _id: highlightId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );
  }

  async deleteHighlight(highlightId, userId) {
    return await Highlight.findOneAndDelete({ _id: highlightId, user: userId });
  }
}
