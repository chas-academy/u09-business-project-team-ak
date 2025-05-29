import express from 'express';
import { fetchAndSaveRecipe } from '../controllers/recipeController';

const router = express.Router();

router.post('/save', fetchAndSaveRecipe);

export default router;
