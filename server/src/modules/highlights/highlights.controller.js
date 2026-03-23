import { HighlightsService } from './highlights.service.js';

export class HighlightsController {
  constructor() {
    this.highlightsService = new HighlightsService();
  }

  createHighlight = async (req, res, next) => {
    try {
      const highlight = await this.highlightsService.createHighlight(
        req.user.userId,
        req.body
      );

      res.status(201).json({
        success: true,
        message: 'Highlight created successfully',
        data: highlight,
      });
    } catch (error) {
      next(error);
    }
  };

  getItemHighlights = async (req, res, next) => {
    try {
      const highlights = await this.highlightsService.getItemHighlights(
        req.user.userId,
        req.params.itemId
      );

      res.status(200).json({
        success: true,
        data: highlights,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserHighlights = async (req, res, next) => {
    try {
      const highlights = await this.highlightsService.getUserHighlights(
        req.user.userId
      );

      res.status(200).json({
        success: true,
        data: highlights,
      });
    } catch (error) {
      next(error);
    }
  };

  updateHighlight = async (req, res, next) => {
    try {
      const highlight = await this.highlightsService.updateHighlight(
        req.user.userId,
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Highlight updated successfully',
        data: highlight,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteHighlight = async (req, res, next) => {
    try {
      await this.highlightsService.deleteHighlight(
        req.user.userId,
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: 'Highlight deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
