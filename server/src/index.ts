import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './libs/db'
import AuthRoutes from './routes/auth.route'
import NotesRoutes from './routes/notes.routes'
import cookieParser from "cookie-parser";
import path from "path"


dotenv.config()





const app=express()
app.use(express.json()); 
app.use(cookieParser());
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:5173",       
    methods:"GET,POST,PUT,DELETE",
    credentials: true,  
  })
);


connectDb()
const PORT=process.env.PORT || 8000

app.use('/api/auth',AuthRoutes)
app.use("/api/notes", NotesRoutes);

//
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(process.cwd(), "..", "client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "..", "client", "dist", "index.html"));
  });
}

app.listen(PORT,()=>{
    console.log(`App is running on PORT: ${PORT}`)
})