import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: any, res: Response, expiry: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //milliseconds
    httpOnly: true, //prevents XSS scripting
    sameSite: "strict", //CSRF attacks prevent
    secure: process.env.NODE_ENV === "production", // Only set to true in production
  });

  return token;
};