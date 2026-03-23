import { Item, Embedding, Relation } from '../../core/database/models/index.js';

export class SearchRepository {
  async findSimilarItems(userId, similarities) {
    const itemIds = similarities.map(s => s.itemId);
    const items = await Item.find({ _id: { $in: itemIds }, user: userId }).lean();
    
    const itemMap = new Map(items.map(item => [item._id.toString(), item]));
    
    return similarities.map(sim => ({
      ...itemMap.get(sim.itemId.toString()),
      similarity: sim.similarity,
    }));
  }

  async findRelatedItems(userId, itemId) {
    return await Relation.find({
      user: userId,
      $or: [{ sourceItem: itemId }, { targetItem: itemId }],
    })
      .populate('sourceItem')
      .populate('targetItem')
      .sort({ strength: -1 });
  }

  async findItemsByTags(userId, tags, limit = 20) {
    return await Item.find({
      user: userId,
      tags: { $in: tags },
    })
      .limit(limit)
      .lean();
  }

  async getGraphData(userId) {
    const items = await Item.find({ user: userId })
      .select('_id title type')
      .lean();

    const relations = await Relation.find({ user: userId })
      .select('sourceItem targetItem strength relationType')
      .lean();

    const nodes = items.map(item => ({
      id: item._id.toString(),
      label: item.title,
      type: item.type,
    }));

    const links = relations.map(rel => ({
      source: rel.sourceItem.toString(),
      target: rel.targetItem.toString(),
      weight: rel.strength,
      type: rel.relationType,
    }));

    return { nodes, links };
  }
}
