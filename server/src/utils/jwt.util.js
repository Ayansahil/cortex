import jwt from 'jsonwebtoken';
import config from '../core/config/env.config.js';

export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expire }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpire }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};
