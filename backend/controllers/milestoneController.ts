import { Request, Response } from 'express';
import Recipe from '../models/Recipe';
import MealPlan from '../models/MealPlan';
import { IUser } from '../models/User';
import { IMealPlan } from '../interfaces/MealPlan';
import axios from 'axios';

export const getMilestones = async (req: Request, res: Response) => {
  const user = req.user as IUser;

  if (!user || !user._id) {
    return res.status(401).json({ error: 'Unauthorized - user not found' });
  }

  try {
    const savedRecipesCount = await Recipe.countDocuments();

    const mealPlans = await MealPlan.find({ userId: user._id }) as unknown as IMealPlan[];

    const mealPlansCount = mealPlans.length;

    const totalMealsPlanned = mealPlans.reduce((total, plan) => {
      return total + plan.breakfast.length + plan.lunch.length + plan.dinner.length;
    }, 0);

    const jokeRes = await axios.get(`https://api.spoonacular.com/food/jokes/random?apiKey=${process.env.SPOONACULAR_API_KEY}`);
    const foodJoke = jokeRes.data.text;

    res.json({
      savedRecipesCount,
      mealPlansCount,
      totalMealsPlanned,
      foodJoke,
    });
  } catch (err) {
    console.error('Error fetching milestones:', err);
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
};

