import express from 'express';
import {
  fetchAndSaveRecipe,
  getAllRecipes,
  getRecipeById,
  deleteRecipe
} from '../controllers/recipeController';

const router = express.Router();

router.post('/save', fetchAndSaveRecipe);
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.delete('/:id', deleteRecipe);

export default router;
