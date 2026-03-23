import { AuthRepository } from './auth.repository.js';
import { generateToken, generateRefreshToken } from '../../utils/jwt.util.js';

export class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(userData) {
    const existingUser = await this.authRepository.findUserByEmail(userData.email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await this.authRepository.createUser(userData);

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return {
      user: user.toJSON(),
      token,
      refreshToken,
    };
  }

  async login(email, password) {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    await this.authRepository.updateLastLogin(user._id);

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return {
      user: user.toJSON(),
      token,
      refreshToken,
    };
  }

  async getProfile(userId) {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await this.authRepository.updateUser(userId, updateData);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
