import express from 'express';
import { HighlightsController } from './highlights.controller.js';
import { authenticate } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();
const highlightsController = new HighlightsController();

router.use(authenticate);

router.post('/', highlightsController.createHighlight);
router.get('/', highlightsController.getUserHighlights);
router.get('/item/:itemId', highlightsController.getItemHighlights);
router.put('/:id', highlightsController.updateHighlight);
router.delete('/:id', highlightsController.deleteHighlight);

export default router;
