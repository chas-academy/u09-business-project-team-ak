import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
}

const userSchema = new Schema<IUser>({
  googleId: { type: String, required: true },
  name: String,
  email: String,
});

export default mongoose.model<IUser>('User', userSchema);
