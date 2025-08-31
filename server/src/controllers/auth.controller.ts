import { Request,Response } from "express"
import { User } from "../models/user.model";
import { generateToken } from "../libs/utils";
import crypto from "crypto";
import { SendOtp } from "../middleware/email";



export const signup=async(req:Request,res:Response)=>{
    try {
        const {name,email,dob}=req.body;

        if(!name || !email || !dob){
            return res.status(400).json({message:"all fields are required"})
        }

        //find if user exists
        const ExistingUser= await User.findOne({email})
        //if user exists  
        if(ExistingUser){
            return res.status(400).json({message:"User already exists"})
        }

        //otp
        const otp=crypto.randomInt(100000,999999).toString()
        const otpExpiry=new Date(Date.now() + 5 * 60 * 1000);

        //if the user is new add it to db
         //new user 
        const newUser=new User({
            name:name,
            email:email,
            dob:dob,
            otp:otp,
            otpExpiry:otpExpiry
        })

         if(newUser){
            //generate jwt token 
            //generateToken(newUser._id,res)

            //save new user afteer generating jwt token 
            await newUser.save()

            //send oyp
            await SendOtp(newUser.email,otp)

            //
            res.status(201).json({
                _id:newUser._id,
                name:name,
                email:newUser.email,
                dob:newUser.dob,
                // otp:newUser.otp,
                // otpExpiry:newUser.otpExpiry
            })
        }else{
            return res.status(400).json({message:"Invalid user data"});
        }

       
    } catch (error) {
      
            console.log("error in signup controller", error);
    

        res.status(500).json({message:"internal server error "})
    }
}



export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (!user.otpExpiry || user.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });

    // Mark user verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT
    generateToken(user._id, res);

    res.status(200).json({
      message: "OTP verified successfully",
      _id: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const signin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found. Please signup first." });

    // Generate OTP and expiry
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await SendOtp(email, otp);

    res.status(200).json({ message: "Signin OTP sent to your email" });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const signout = (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0), 
    });

    return res.status(200).json({ message: "Signedout out successfully" });
  } catch (error: any) {
    console.log("error in signout controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
