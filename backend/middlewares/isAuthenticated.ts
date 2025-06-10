import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.log('isAuthenticated running for path:', req.path);
  console.log('req.isAuthenticated:', typeof req.isAuthenticated === 'function' ? req.isAuthenticated() : 'not a function');

  if (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};
