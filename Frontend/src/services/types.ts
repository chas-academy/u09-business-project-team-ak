// For recipe nutrition info (from Spoonacular Nutrition Widget)
export interface NutritionInfoResponse {
  calories: string;
  carbs: string;
  fat: string;
  protein: string;
}

// For recipe instructions (from Spoonacular Recipe Information)
export interface RecipeInstructionsResponse {
  instructions: string;
}

// Example type for a recipe (if you need for backend responses or frontend state)
export interface Recipe {
  id: number;
  title: string;
  image: string;
  [key: string]: unknown; // Extendable for other fields
}

// Example type for Meal Plan
export interface MealPlan {
  id: number;
  name: string;
  recipes: Recipe[];
}
