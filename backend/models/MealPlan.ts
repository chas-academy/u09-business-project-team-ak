import mongoose, { Schema } from 'mongoose';
import { IMealPlan } from '../interfaces/MealPlan';

const mealPlanSchema = new Schema<IMealPlan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  breakfast: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  lunch: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  dinner: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
});

export default mongoose.model<IMealPlan>('MealPlan', mealPlanSchema);
