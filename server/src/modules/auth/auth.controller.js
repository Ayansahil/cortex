import { AuthService } from './auth.service.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res, next) => {
    try {
      const { email, password, name } = req.body;

      const result = await this.authService.register({
        email,
        password,
        name,
      });

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login(email, password);

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req, res, next) => {
    try {
      const user = await this.authService.getProfile(req.user.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const user = await this.authService.updateProfile(
        req.user.userId,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
  logout = async (req, res, next) => {
    try {
      res.clearCookie('token');
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
