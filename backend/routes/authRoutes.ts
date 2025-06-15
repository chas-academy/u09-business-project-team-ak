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
    res.redirect(process.env.FRONTEND_URL as string); // ✅ Dynamisk baserat på miljövariabel
  }
);

router.get('/profile', getProfile);
router.get('/logout', logout);

export default router;
