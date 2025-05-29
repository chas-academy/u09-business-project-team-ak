import mongoose, { Document, Schema } from 'mongoose';

export interface IRecipe extends Document {
  title: string;
  spoonacularId: number;
  image: string;
  instructions: string;
}

const recipeSchema = new Schema<IRecipe>({
  title: { type: String, required: true },
  spoonacularId: { type: Number, required: true },
  image: String,
  instructions: String,
});

export default mongoose.model<IRecipe>('Recipe', recipeSchema);
