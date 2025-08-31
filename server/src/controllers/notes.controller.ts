import { Request, Response } from "express";

import { AuthRequest } from "../middleware/auth";
import { Notes } from "../models/notes.model";

// Create Note
export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Notes.create({
      user: req.user._id,
      title:title,
      content:content,
    });

    res.status(201).json(note);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error creating note" });
  }
};

// Get All Notes for the signed in user 
export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Notes.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

// Update Note
export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Notes.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) return res.status(404).json({ message: "Note not found" });

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Error updating note" });
  }
};

// Delete Note
export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Notes.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note" });
  }
};
