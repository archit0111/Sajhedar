import { connectDB } from "@/lib/mongodb";
import Otp from "@/models/Otp";
import User from "@/models/User";
import {NextApiRequest, NextApiResponse} from "next";
import nodemailer from "nodemailer";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method !== 'POST'){
        return res.status(405).json({error:`Method ${req.method} Not Allowed`});
    }

    const {email}=req.body;
    if(!email) return res.status(400).json({error:"Email is required"});
    

    try{
        await connectDB();

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({error:"User already exists with this email."})
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(otp);

        await Otp.findOneAndUpdate(
         { email },
         { otp, createdAt: new Date() },
         { upsert: true, new: true }
        );

        const transporter =nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from:`"Sajhedar" <${process.env.SMTP_USER}>`,
            to:email,
            subject:"Your Email Verification OTP",
            html:`<h3>Your verification code is: <b>${otp}</b></h3>`
        });

        return res.status(200).json({message:"OTP sent!"});

    }catch(error){
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}