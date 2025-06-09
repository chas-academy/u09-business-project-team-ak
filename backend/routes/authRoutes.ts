import express from 'express';
import passport from 'passport';
import { getProfile, logout } from '../controllers/authController';

const router = express.Router();

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('✅ Auth success:', req.user);
    res.redirect('http://localhost:5173'); // Redirect to your frontend
  }
);

router.get('/profile', getProfile);
router.get('/logout', logout);

export default router;
