import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { connectDB } from "@/lib/mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!=="POST"){
        return res.status(405).json({message:"Method not allowed"});
    }

    const {name, email, password,otp}= req.body;

    if(!name || !email || !password || !otp){
        return res.status(400).json({messsage:"All fields are reqired"});
    }

    try{
        await connectDB();
        //check if user exixt already
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(422).json({message:"User already exists!"});
        }
        console.log(existingUser);

        const record = await Otp.findOne({email});
        if(!record || record.otp !==otp){
            return res.status(400).json({message:"Invalid or expired OTP."})
        }

        const hashedPassword = await bcrypt.hash(password,12);

        await User.create({
            name,email,password:hashedPassword,createdAt: new Date()
        })

        await Otp.deleteOne({ email });

        return res.status(201).json({message:"User created successfully!"});
    }catch(e){
        return res.status(500).json({message:"Internal server error",e});
    }
}