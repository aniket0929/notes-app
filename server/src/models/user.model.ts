import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  dob: Date;
  otp?: string | undefined;
  otpExpiry?: Date | undefined;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
    isVerified: {
       type: Boolean, 
       default: false },
});

export const User = mongoose.model<IUser>("User", userSchema);
