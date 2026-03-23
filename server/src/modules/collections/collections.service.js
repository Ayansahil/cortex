import { CollectionsRepository } from './collections.repository.js';

export class CollectionsService {
  constructor() {
    this.collectionsRepository = new CollectionsRepository();
  }

  async createCollection(userId, collectionData) {
    return await this.collectionsRepository.createCollection({
      ...collectionData,
      user: userId,
    });
  }

  async getCollections(userId) {
    return await this.collectionsRepository.findUserCollections(userId);
  }

  async getCollectionById(userId, collectionId) {
    const collection = await this.collectionsRepository.findCollectionById(
      collectionId,
      userId
    );

    if (!collection) {
      throw new Error('Collection not found');
    }

    return collection;
  }

  async updateCollection(userId, collectionId, updateData) {
    const collection = await this.collectionsRepository.updateCollection(
      collectionId,
      userId,
      updateData
    );

    if (!collection) {
      throw new Error('Collection not found');
    }

    return collection;
  }

  async deleteCollection(userId, collectionId) {
    const collection = await this.collectionsRepository.deleteCollection(
      collectionId,
      userId
    );

    if (!collection) {
      throw new Error('Collection not found');
    }

    return collection;
  }

  async addItemToCollection(userId, collectionId, itemId) {
    return await this.collectionsRepository.addItemToCollection(
      collectionId,
      userId,
      itemId
    );
  }

  async removeItemFromCollection(userId, collectionId, itemId) {
    return await this.collectionsRepository.removeItemFromCollection(
      collectionId,
      userId,
      itemId
    );
  }
}
