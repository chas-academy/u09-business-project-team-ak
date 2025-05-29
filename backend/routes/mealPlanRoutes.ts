import express from 'express';
import { saveMealPlan, getMealPlan } from '../controllers/mealPlanController';

const router = express.Router();

router.post('/', saveMealPlan);
router.get('/:date', getMealPlan);

export default router;
