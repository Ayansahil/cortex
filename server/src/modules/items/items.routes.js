import express from 'express';
import { ItemsController } from './items.controller.js';
import { authenticate } from '../../core/middlewares/auth.middleware.js';
import upload from '../../core/middlewares/upload.middleware.js';

const router = express.Router();
const itemsController = new ItemsController();

router.use(authenticate);

router.post('/', upload.single('file'), itemsController.createItem);
router.get('/', itemsController.getItems);
router.get('/stats', itemsController.getStats);
router.get('/:id', itemsController.getItemById);
router.put('/:id', itemsController.updateItem);
router.delete('/:id', itemsController.deleteItem);

export default router;
