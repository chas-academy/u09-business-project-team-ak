import { Types } from 'mongoose';

export interface IRecipe {
  spoonacularId: number;
  title: string;
  image: string;
  instructions: string;
  userId: Types.ObjectId; // <- added to match your MealPlan pattern
}
