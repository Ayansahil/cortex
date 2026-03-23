import express from 'express';
import { CollectionsController } from './collections.controller.js';
import { authenticate } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();
const collectionsController = new CollectionsController();

router.use(authenticate);

router.post('/', collectionsController.createCollection);
router.get('/', collectionsController.getCollections);
router.get('/:id', collectionsController.getCollectionById);
router.put('/:id', collectionsController.updateCollection);
router.delete('/:id', collectionsController.deleteCollection);
router.post('/:id/items', collectionsController.addItemToCollection);
router.delete('/:id/items', collectionsController.removeItemFromCollection);

export default router;
