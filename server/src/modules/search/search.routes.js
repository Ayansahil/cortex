import express from 'express';
import { SearchController } from './search.controller.js';
import { authenticate } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();
const searchController = new SearchController();

router.use(authenticate);

router.get('/', searchController.semanticSearch);
router.get('/semantic', searchController.semanticSearch);
router.get('/related/:itemId', searchController.getRelatedItems);
router.get('/graph', searchController.getGraph);
router.get('/tags', searchController.searchByTags);

export default router;
