import axios from 'axios';
import type { AxiosError } from 'axios/index';
import { Request, Response } from 'express';
import Recipe from '../models/Recipe';

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  instructions: string;
}

export const fetchAndSaveRecipe = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const response = await axios.get<SpoonacularRecipe>(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
    );

    const data = response.data;

    const recipe = await Recipe.create({
      title: data.title,
      spoonacularId: data.id,
      image: data.image,
      instructions: data.instructions
    });

    res.json(recipe);
    } catch (error) {
    const err = error as AxiosError;
    console.error('Spoonacular fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch/save recipe' });
  }
};
