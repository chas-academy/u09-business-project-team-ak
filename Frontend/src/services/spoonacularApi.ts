import { spoonacular } from './api';
import { NutritionInfoResponse, RecipeInstructionsResponse } from './types';

export const getNutritionInfo = async (recipeId: number): Promise<NutritionInfoResponse> => {
  const res = await spoonacular.get<NutritionInfoResponse>(
    `/recipes/${recipeId}/nutritionWidget.json`
  );
  return res.data;
};

export const getRecipeInstructions = async (recipeId: number): Promise<string> => {
  const res = await spoonacular.get<RecipeInstructionsResponse>(
    `/recipes/${recipeId}/information`
  );
  return res.data.instructions || "No instructions.";
};
