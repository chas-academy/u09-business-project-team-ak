import express from 'express';
import passport from 'passport';

const router = express.Router();

// Redirect user to Google for authentication
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google will redirect here after authentication
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: process.env.FRONTEND_URL || '/'
  })
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.redirect(process.env.FRONTEND_URL || '/');
  });
});

export default router;
