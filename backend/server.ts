import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';

import './config/passport';
import authRoutes from './routes/authRoutes';
import { getProfile } from './controllers/authController';
import recipeRoutes from './routes/recipeRoutes';
import mealPlanRoutes from './routes/mealPlanRoutes';
import milestoneRoutes from './routes/milestoneRoutes';

dotenv.config();

const app = express();
app.set('trust proxy', 1); // trust Docker proxy or production proxy

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: blob:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self';"
  );
  next();
});

// CORS
const CLIENT_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));



// Parsers
app.use(express.json());
app.use(cookieParser());

// Sessions (must be before passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 24 * 60 * 60, // 1 day
  }),
  cookie: {
    secure: false, // true in production with HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Debug route (moved here, after session + passport setup)
app.get('/debug-session', (req, res) => {
  console.log('🧪 Session:', req.session);
  console.log('🧪 User:', req.user);
  res.json({ session: req.session, user: req.user });
});

// Favicon fallback
app.get('/favicon.ico', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'favicon.ico');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(204).setHeader('Content-Type', 'image/x-icon').end();
  }
});

// Routes
app.get('/profile', getProfile);
app.use('/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/milestones', milestoneRoutes);

// Start server
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
