import { transporter } from "./email.config";



export const SendOtp=async (email: string, otp: string): Promise<void> =>{
    try {
    const response = await transporter.sendMail({
    from: '"NotesApp by Aniket" <aniketgavate12345@gmail.com>',
    to: email,
    subject: "OTP for the notes app",
    text: `Your OTP is ${otp}`, // plain‑text body
    html: `<b>Your OTP is: ${otp}</b>`, // HTML body
  });
  console.log("Email sent succesfully",response)

    } catch (error) {
        console.log("Email Error",error)
    }
}