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

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res.status(500).json({ error: 'Failed to destroy session' });
      }

      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // Set to true in production with HTTPS
      });

      res.status(200).json({ success: true });
    });
  });
};
