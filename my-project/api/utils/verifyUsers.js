import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  // Check both cookie and Authorization header
  const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next(errorHandler(401, 'Authentication required'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(errorHandler(401, 'Token expired', {code: 'TOKEN_EXPIRED'}));
      }
      return next(errorHandler(401, 'Invalid token', {code: 'INVALID_TOKEN'}));
    }
    
    req.user = decoded;
    next();
  });
};