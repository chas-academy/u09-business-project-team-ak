import { Request, Response } from 'express';

export const getProfile = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(req.user);
};

export const logout = (req: Request, res: Response) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.redirect('/');
  });
};
