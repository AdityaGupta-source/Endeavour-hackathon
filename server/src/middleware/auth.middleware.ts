import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: 'Authentication required. No token provided.' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
    
    // Add user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token. Authentication failed.' });
    return;
  }
};

// Check if user has admin role
export const isAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
    return;
  }
  
  res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  return;
};

// Check if user is the owner or an admin
export const isOwnerOrAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.user && 
    (req.user.role === 'admin' || req.user.id === parseInt(req.params.id))
  ) {
    next();
    return;
  }
  
  res.status(403).json({ message: 'Access denied. Not authorized to access this resource.' });
  return;
}; 