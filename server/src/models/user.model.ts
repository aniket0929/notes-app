import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name:string,
  email: string;
  dob: Date;
  otp?: string | undefined;
  otpExpiry?: Date | undefined;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
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
