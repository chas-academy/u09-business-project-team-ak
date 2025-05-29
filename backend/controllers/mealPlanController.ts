import { Request, Response } from 'express';
import MealPlan from '../models/MealPlan';
import { IUser } from '../models/User';

export const saveMealPlan = async (req: Request, res: Response) => {
  try {
    const { date, breakfast, lunch, dinner } = req.body;

    const user = req.user as IUser;

    const mealPlan = await MealPlan.findOneAndUpdate(
      { userId: user._id, date },
      { breakfast, lunch, dinner },
      { new: true, upsert: true }
    );

    res.json(mealPlan);
  } catch (err) {
    console.error('Save meal plan error:', err);
    res.status(500).json({ error: 'Error saving meal plan' });
  }
};

export const getMealPlan = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;

    const user = req.user as IUser;

    const plan = await MealPlan.findOne({ userId: user._id, date }).populate([
      'breakfast',
      'lunch',
      'dinner',
    ]);

    res.json(plan);
  } catch (err) {
    console.error('Get meal plan error:', err);
    res.status(500).json({ error: 'Error retrieving meal plan' });
  }
};
