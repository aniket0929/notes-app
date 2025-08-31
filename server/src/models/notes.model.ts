import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
    //user referenc
  user: mongoose.Schema.Types.ObjectId; 
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Notes = mongoose.model<INote>("Notes", noteSchema);
