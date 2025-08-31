import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './libs/db'
import AuthRoutes from './routes/auth.route'
import NotesRoutes from './routes/notes.routes'
import cookieParser from "cookie-parser";

dotenv.config()





const app=express()
app.use(express.json()); 
app.use(cookieParser());
import cors from "cors";

app.use(
  cors({
    origin: true,       
    credentials: true,  
  })
);


connectDb()
const PORT=process.env.PORT || 8000

app.use('/api/auth',AuthRoutes)
app.use("/api/notes", NotesRoutes);

app.listen(PORT,()=>{
    console.log(`App is running on PORT: ${PORT}`)
})