import { Collection } from '../../core/database/models/index.js';

export class CollectionsRepository {
  async createCollection(collectionData) {
    const collection = new Collection(collectionData);
    return await collection.save();
  }

  async findCollectionById(collectionId, userId) {
    return await Collection.findOne({ _id: collectionId, user: userId }).populate('items');
  }

  async findUserCollections(userId) {
    return await Collection.find({ user: userId })
      .populate('items', 'title thumbnail type')
      .sort({ createdAt: -1 });
  }

  async updateCollection(collectionId, userId, updateData) {
    return await Collection.findOneAndUpdate(
      { _id: collectionId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );
  }

  async deleteCollection(collectionId, userId) {
    return await Collection.findOneAndDelete({ _id: collectionId, user: userId });
  }

  async addItemToCollection(collectionId, userId, itemId) {
    const collection = await Collection.findOne({ _id: collectionId, user: userId });
    if (collection) {
      const itemIdStr = itemId.toString();
      if (!collection.items.some(id => id.toString() === itemIdStr)) {
        collection.items.push(itemId);
        return await collection.save();
      }
    }
    return collection;
  }

  async removeItemFromCollection(collectionId, userId, itemId) {
    const collection = await Collection.findOne({ _id: collectionId, user: userId });
    if (collection) {
      collection.items = collection.items.filter(id => id.toString() !== itemId.toString());
      return await collection.save();
    }
    return collection;
  }
}
