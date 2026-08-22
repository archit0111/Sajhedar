import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from 'nodemailer';

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method!=='POST'){
        return res.status(405).json({message:"Method not allowed"})
    }
    const {email}= req.body;
    try{
        await connectDB();
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(404).json({message:"User Not Found"})
        }
        
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS
            }
        });
         await transporter.sendMail({
            from:`Sajhedar <${process.env.SMTP_USER}>`,
            to:email,
            subject:"Password reset link requested by you",
            html:`
            <div style='font-family: sans-serif; padding:20px;'>
            <h2>Hey there! 👋</h2>
            <p>The password reset link is requested by you. So, the link is provided below click the link to reset your password.</p>
            <p>If you not requested, please ignore it.</p>
            <p><strong>Reset Link:</strong> ${email}</p>
            <p>${process.env.NEXT_PUBLIC_APP_URL+'/resetPassword/'+email}</p>
            <p style='padding-top:20px'></p>
            <p>Thankyou😊 & Happy journey</p>
            </div>`
         });
         return res.status(200).json({message:"Reset Link Sent Successfully"})
    }catch(e){
        res.status(500).json({message:"Internal Server Error!",e})
    }
}