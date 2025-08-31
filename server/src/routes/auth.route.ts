import express from "express";
import { signin, signout, signup, verifyOtp } from "../controllers/auth.controller";

 const AuthRoutes = express.Router();

AuthRoutes.post('/signup',signup)
AuthRoutes.post('/signin',signin)
AuthRoutes.post('/verify-otp',verifyOtp)
AuthRoutes.post('/signout',signout)

export default AuthRoutes