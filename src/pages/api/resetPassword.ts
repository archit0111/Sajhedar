import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from 'nodemailer';
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method!=='PATCH'){
        return res.status(405).json({message:"Method not allowed"})
    }
    const {password,email}= req.body;
    try{
        await connectDB();
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(404).json({message:"User Not Found"})
        }
        
        const hashedPassword = await bcrypt.hash(password,12);

        const result =  await User.updateOne(
            {email:email},
            {$set:{password:hashedPassword}}
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
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
            subject:"Your password is changed successfully.",
            html:`
            <div style='font-family: sans-serif; padding:20px;'>
            <h2>Hey there! 👋</h2>
            <p>The password is changed successfuly, Now you can login with your new password.</p>
            <p>Your credentials are given below.</p>
            <p><strong>Your email:</strong> ${email}</p>
            <p><strong>Your new password:</strong> ${password}</p>
            <p style='padding-top:20px'></p>
            <p>Thankyou😊 & Happy journey</p>
            </div>`
         });
         return res.status(200).json({message:"Password Reset Successfully!"})
    }catch(e){
        res.status(500).json({message:"Internal Server Error!",e})
    }
}