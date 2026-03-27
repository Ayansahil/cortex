import rateLimit from 'express-rate-limit';

/**
 * Rate limiter middleware to prevent abuse and brute-force attacks.
 * Limit: 100 requests per 15 minutes per IP.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
