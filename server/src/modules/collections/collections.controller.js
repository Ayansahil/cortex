import { CollectionsService } from './collections.service.js';

export class CollectionsController {
  constructor() {
    this.collectionsService = new CollectionsService();
  }

  createCollection = async (req, res, next) => {
    try {
      const collection = await this.collectionsService.createCollection(
        req.user.userId,
        req.body
      );

      res.status(201).json({
        success: true,
        message: 'Collection created successfully',
        data: collection,
      });
    } catch (error) {
      next(error);
    }
  };

  getCollections = async (req, res, next) => {
    try {
      const collections = await this.collectionsService.getCollections(
        req.user.userId
      );

      res.status(200).json({
        success: true,
        data: collections,
      });
    } catch (error) {
      next(error);
    }
  };

  getCollectionById = async (req, res, next) => {
    try {
      const collection = await this.collectionsService.getCollectionById(
        req.user.userId,
        req.params.id
      );

      res.status(200).json({
        success: true,
        data: collection,
      });
    } catch (error) {
      next(error);
    }
  };

  updateCollection = async (req, res, next) => {
    try {
      const collection = await this.collectionsService.updateCollection(
        req.user.userId,
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Collection updated successfully',
        data: collection,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCollection = async (req, res, next) => {
    try {
      await this.collectionsService.deleteCollection(
        req.user.userId,
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: 'Collection deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  addItemToCollection = async (req, res, next) => {
    try {
      const { itemId } = req.body;

      const collection = await this.collectionsService.addItemToCollection(
        req.user.userId,
        req.params.id,
        itemId
      );

      res.status(200).json({
        success: true,
        message: 'Item added to collection',
        data: collection,
      });
    } catch (error) {
      next(error);
    }
  };

  removeItemFromCollection = async (req, res, next) => {
    try {
      const { itemId } = req.body;

      const collection = await this.collectionsService.removeItemFromCollection(
        req.user.userId,
        req.params.id,
        itemId
      );

      res.status(200).json({
        success: true,
        message: 'Item removed from collection',
        data: collection,
      });
    } catch (error) {
      next(error);
    }
  };
}
