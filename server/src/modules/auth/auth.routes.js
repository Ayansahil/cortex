import express from 'express';
import { body } from 'express-validator';
import { AuthController } from './auth.controller.js';
import { authenticate } from '../../core/middlewares/auth.middleware.js';
import { validate } from '../../core/middlewares/validate.middleware.js';

const router = express.Router();
const authController = new AuthController();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty().trim(),
    validate,
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate,
  ],
  authController.login
);

router.get('/profile', authenticate, authController.getProfile);

router.put('/profile', authenticate, authController.updateProfile);

export default router;
