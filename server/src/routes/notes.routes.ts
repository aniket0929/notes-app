import express from "express";
import { signin, signout, signup, verifyOtp } from "../controllers/auth.controller";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/notes.controller";
import { protect } from "../middleware/auth";

 const NotesRoutes = express.Router();

NotesRoutes.post("/", protect, createNote);
NotesRoutes.get("/", protect, getNotes);
NotesRoutes.put("/:id", protect, updateNote);
NotesRoutes.delete("/:id", protect, deleteNote);

export default NotesRoutes