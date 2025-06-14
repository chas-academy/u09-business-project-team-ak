import express from 'express';
import { saveMealPlan, getMealPlan, deleteRecipeFromMealPlan } from '../controllers/mealPlanController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const router = express.Router();

router.post('/', isAuthenticated, saveMealPlan);
router.get('/:date', isAuthenticated, getMealPlan);
router.delete('/:date/:mealType/:recipeId', isAuthenticated, deleteRecipeFromMealPlan);

export default router;
