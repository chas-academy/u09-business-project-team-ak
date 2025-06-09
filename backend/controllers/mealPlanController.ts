import { Request, Response } from 'express';
import MealPlan from '../models/MealPlan';
import Recipe from '../models/Recipe';
import { IUser } from '../models/User';

export const saveMealPlan = async (req: Request, res: Response) => {
  const { date, mealType, recipe } = req.body;
  const user = req.user as IUser;

  try {
    // 1. Check if recipe exists by spoonacularId
    let existingRecipe = await Recipe.findOne({ spoonacularId: recipe.spoonacularId });

    // 2. If not found, create it
    if (!existingRecipe) {
      existingRecipe = new Recipe({
        spoonacularId: recipe.spoonacularId,
        title: recipe.title,
        image: recipe.image
      });
      await existingRecipe.save();
    }

    // 3. Update the meal plan with reference to Recipe _id
    const plan = await MealPlan.findOneAndUpdate(
      { userId: user._id, date },
      { $push: { [mealType]: existingRecipe._id } },
      { new: true, upsert: true }
    );

    res.json(plan);
  } catch (e) {
    console.error('❌ Error saving meal plan:', e);
    res.status(500).json({ error: 'Error saving meal plan' });
  }
};

export const getMealPlan = async (req: Request, res: Response) => {
  const { date } = req.params;
  const user = req.user as IUser;

  try {
    const plan = await MealPlan.findOne({ userId: user._id, date })
      .populate('breakfast')
      .populate('lunch')
      .populate('dinner');

    res.json(plan);
  } catch (e) {
    console.error('❌ Error fetching meal plan:', e);
    res.status(500).json({ error: 'Error fetching meal plan' });
  }
};
