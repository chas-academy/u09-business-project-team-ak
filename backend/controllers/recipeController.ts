import { Request, Response } from 'express';
import Recipe from '../models/Recipe';

// Save a recipe if it doesn't already exist
export const fetchAndSaveRecipe = async (req: Request, res: Response) => {
  const { title, spoonacularId, image } = req.body;

  try {
    let existing = await Recipe.findOne({ spoonacularId });

    if (!existing) {
      existing = new Recipe({ title, spoonacularId, image });
      await existing.save();
    }

    res.status(201).json(existing);
  } catch (e) {
    console.error('❌ Error saving recipe:', e);
    res.status(500).json({ error: 'Error saving recipe' });
  }
};

// Get all saved recipes
export const getAllRecipes = async (_req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (e) {
    console.error('❌ Error fetching recipes:', e);
    res.status(500).json({ error: 'Error fetching recipes' });
  }
};

// Get one recipe by MongoDB ID
export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (e) {
    console.error('❌ Error fetching recipe:', e);
    res.status(500).json({ error: 'Error fetching recipe' });
  }
};

// Delete a recipe by MongoDB ID
export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const result = await Recipe.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (e) {
    console.error('❌ Error deleting recipe:', e);
    res.status(500).json({ error: 'Error deleting recipe' });
  }
};
