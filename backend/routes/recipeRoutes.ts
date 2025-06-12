import { isAuthenticated } from '../middlewares/isAuthenticated';
import express from 'express';
import {
  fetchAndSaveRecipe,
  getAllRecipes,
  getRecipeById,
  deleteRecipe
} from '../controllers/recipeController';

const router = express.Router();

router.post('/save', isAuthenticated, fetchAndSaveRecipe);
router.get('/', isAuthenticated, getAllRecipes);
router.get('/:id', isAuthenticated, getRecipeById);
router.delete('/:id', isAuthenticated, deleteRecipe);

export default router;
