import { SearchService } from './search.service.js';

export class SearchController {
  constructor() {
    this.searchService = new SearchService();
  }

  semanticSearch = async (req, res, next) => {
    try {
      const { q, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Query parameter required',
        });
      }

      const results = await this.searchService.semanticSearch(
        req.user.userId,
        q,
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  };

  getRelatedItems = async (req, res, next) => {
    try {
      const { itemId } = req.params;
      const { limit = 5 } = req.query;

      const results = await this.searchService.getRelatedItems(
        req.user.userId,
        itemId,
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  };

  getGraph = async (req, res, next) => {
    try {
      const graphData = await this.searchService.getGraphData(req.user.userId);

      res.status(200).json({
        success: true,
        data: graphData,
      });
    } catch (error) {
      next(error);
    }
  };

  searchByTags = async (req, res, next) => {
    try {
      const { tags, limit = 20 } = req.query;

      if (!tags) {
        return res.status(400).json({
          success: false,
          message: 'Tags parameter required',
        });
      }

      const tagArray = tags.split(',');

      const results = await this.searchService.searchByTags(
        req.user.userId,
        tagArray,
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  };
}
