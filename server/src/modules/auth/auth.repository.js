import { User } from '../../core/database/models/index.js';

export class AuthRepository {
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async findUserById(userId) {
    return await User.findById(userId).select('-password');
  }

  async updateLastLogin(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { lastLoginAt: new Date() },
      { new: true }
    );
  }

  async updateUser(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
  }
}
