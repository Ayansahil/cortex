import { ItemsService } from './items.service.js';

export class ItemsController {
  constructor() {
    this.itemsService = new ItemsService();
  }

  createItem = async (req, res, next) => {
    try {
      const item = await this.itemsService.createItem(
        req.user.userId,
        req.body,
        req.file
      );

      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };

  getItems = async (req, res, next) => {
    try {
      const filters = {
        type: req.query.type,
        tags: req.query.tags?.split(','),
        isFavorite: req.query.isFavorite === 'true',
        isArchived: req.query.isArchived === 'true',
        search: req.query.search,
      };

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc',
      };

      const result = await this.itemsService.getItems(
        req.user.userId,
        filters,
        options
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getItemById = async (req, res, next) => {
    try {
      const item = await this.itemsService.getItemById(
        req.user.userId,
        req.params.id
      );

      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req, res, next) => {
    try {
      const item = await this.itemsService.updateItem(
        req.user.userId,
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Item updated successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteItem = async (req, res, next) => {
    try {
      await this.itemsService.deleteItem(req.user.userId, req.params.id);

      res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req, res, next) => {
    try {
      const stats = await this.itemsService.getStats(req.user.userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };
}
