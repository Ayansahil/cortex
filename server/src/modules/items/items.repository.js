import { Item } from '../../core/database/models/index.js';

export class ItemsRepository {
  async createItem(itemData) {
    const item = new Item(itemData);
    return await item.save();
  }

  async findItemById(itemId, userId) {
    return await Item.findOne({ _id: itemId, user: userId });
  }

  async findUserItems(userId, filters = {}, options = {}) {
    const {
      type,
      tags,
      isFavorite,
      isArchived,
      search,
    } = filters;

    const query = { user: userId };

    if (type) query.type = type;
    if (tags && tags.length > 0) query.tags = { $in: tags };
    if (typeof isFavorite === 'boolean') query.isFavorite = isFavorite;
    if (typeof isArchived === 'boolean') query.isArchived = isArchived;
    if (search) {
      query.$text = { $search: search };
    }

    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;

    const items = await Item.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Item.countDocuments(query);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateItem(itemId, userId, updateData) {
    return await Item.findOneAndUpdate(
      { _id: itemId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );
  }

  async deleteItem(itemId, userId) {
    return await Item.findOneAndDelete({ _id: itemId, user: userId });
  }

  async incrementViewCount(itemId, userId) {
    return await Item.findOneAndUpdate(
      { _id: itemId, user: userId },
      {
        $inc: { viewCount: 1 },
        $set: { lastViewedAt: new Date() },
      },
      { new: true }
    );
  }

  async findItemsByIds(itemIds, userId) {
    return await Item.find({ _id: { $in: itemIds }, user: userId });
  }

  async getItemStats(userId) {
    const total = await Item.countDocuments({ user: userId });
    const favorites = await Item.countDocuments({ user: userId, isFavorite: true });
    const archived = await Item.countDocuments({ user: userId, isArchived: true });

    const typeStats = await Item.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    return {
      total,
      favorites,
      archived,
      byType: typeStats,
    };
  }
}
