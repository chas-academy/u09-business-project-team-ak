import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRecipe extends Document {
  title: string;
  spoonacularId: number;
  image: string;
  instructions: string;
  userId: Types.ObjectId; // Add this
}

const recipeSchema = new Schema<IRecipe>({
  title: { type: String, required: true },
  spoonacularId: { type: Number, required: true },
  image: String,
  instructions: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true } // And this
});

export default mongoose.model<IRecipe>('Recipe', recipeSchema);
