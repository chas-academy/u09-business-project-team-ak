import { Request, Response } from 'express';
import MealPlan from '../models/MealPlan';
import Recipe from '../models/Recipe';
import { IUser } from '../models/User';

export const saveMealPlan = async (req: Request, res: Response) => {
  const { date, mealType, recipe, removeRecipeId } = req.body;
  const user = req.user as IUser;

  try {
    // Handle removing a recipe from a meal type
    if (removeRecipeId) {
      const plan = await MealPlan.findOneAndUpdate(
        { userId: user._id, date },
        { $pull: { [mealType]: removeRecipeId } },
        { new: true }
      )
        .populate('breakfast')
        .populate('lunch')
        .populate('dinner');

      return res.json(plan);
    }

    // Handle adding a recipe
    let existingRecipe = await Recipe.findOne({ spoonacularId: recipe.spoonacularId });

    if (!existingRecipe) {
      existingRecipe = new Recipe({
        spoonacularId: recipe.spoonacularId,
        title: recipe.title,
        image: recipe.image
      });
      await existingRecipe.save();
    }

    const plan = await MealPlan.findOneAndUpdate(
      { userId: user._id, date },
      { $push: { [mealType]: existingRecipe._id } },
      { new: true, upsert: true }
    )
      .populate('breakfast')
      .populate('lunch')
      .populate('dinner');

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

export const deleteRecipeFromMealPlan = async (req: Request, res: Response) => {
  const { date, mealType, recipeId } = req.params;
  const user = req.user as IUser;

  try {
    const plan = await MealPlan.findOneAndUpdate(
      { userId: user._id, date },
      { $pull: { [mealType]: recipeId } },
      { new: true }
    )
      .populate('breakfast')
      .populate('lunch')
      .populate('dinner');

    if (!plan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    res.json(plan);
  } catch (e) {
    console.error('❌ Error deleting recipe from meal plan:', e);
    res.status(500).json({ error: 'Error deleting recipe from meal plan' });
  }
};
