import { Types } from 'mongoose';

export interface IMealPlan {
  userId: Types.ObjectId;
  date: string;
  breakfast: Types.ObjectId;
  lunch: Types.ObjectId;
  dinner: Types.ObjectId;
}
