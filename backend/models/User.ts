import mongoose, { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default model<IUser>('User', userSchema);
