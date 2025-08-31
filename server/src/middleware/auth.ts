import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt; 

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

     if(!decoded){
            return res.status(401).json({message:"unauthorized-invalid token "})
         }

         //u could also first do const user=await.... and the do req.user=user
    req.user = await User.findById(decoded.userId).select("-otp -otpExpiry");

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
