import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './libs/db'
import AuthRoutes from './routes/auth.route'


dotenv.config()


const app=express()
app.use(express.json()); 


connectDb()
const PORT=process.env.PORT || 8000

app.use('/api/auth',AuthRoutes)

app.listen(PORT,()=>{
    console.log(`App is running on PORT: ${PORT}`)
})