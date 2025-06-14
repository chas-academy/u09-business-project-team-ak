import { Request, Response } from 'express';
import Recipe from '../models/Recipe';
import { IUser } from '../models/User';

// Save a recipe for the logged-in user if it doesn't already exist
export const fetchAndSaveRecipe = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { title, spoonacularId, image } = req.body;

  try {
    let existing = await Recipe.findOne({ spoonacularId, userId: user._id });

    if (!existing) {
      existing = new Recipe({ title, spoonacularId, image, userId: user._id });
      await existing.save();
    }

    res.status(201).json(existing);
  } catch (e) {
    console.error('❌ Error saving recipe:', e);
    res.status(500).json({ error: 'Error saving recipe' });
  }
};

export const getAllRecipes = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const recipes = await Recipe.find({ userId: user._id });
    res.json(recipes);
  } catch (e) {
    console.error('❌ Error fetching recipes:', e);
    res.status(500).json({ error: 'Error fetching recipes' });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, userId: user._id });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (e) {
    console.error('❌ Error fetching recipe:', e);
    res.status(500).json({ error: 'Error fetching recipe' });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await Recipe.findOneAndDelete({ _id: req.params.id, userId: user._id });
    if (!result) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (e) {
    console.error('❌ Error deleting recipe:', e);
    res.status(500).json({ error: 'Error deleting recipe' });
  }
};
