import express from 'express';
import { saveMealPlan, getMealPlan } from '../controllers/mealPlanController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const router = express.Router();

router.post('/', isAuthenticated, saveMealPlan);
router.get('/:date', isAuthenticated, getMealPlan);

export default router;
