import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!=="POST"){
        return res.status(405).json({message:"Method not allowed"});
    }

    const {name, email, password}= req.body;
    console.log(email);
    
    console.log(password);
    console.log(name);
    if(!name || !email || !password){
        return res.status(400).json({messsage:"All fields are reqired"});
    }

    try{
        const client = await clientPromise;
        const db = client.db('Sajhedar');

        //check if user exixt already
        const existingUser = await db.collection("users").findOne({email});
        if(existingUser){
            return res.status(422).json({message:"User already exists!"});
        }
        const hashedPassword = await bcrypt.hash(password,12);

        await db.collection("users").insertOne({
            name,email,password:hashedPassword,createdAt: new Date()
        })
        return res.status(201).json({message:"User created successfully!"});
    }catch(e){
        return res.status(500).json({message:"Internal server error"});
    }
}