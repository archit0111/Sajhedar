import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    const { id }= req.query;

    if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid User ID" });
  }

    if(req.method==='GET'){
        try{
            await connectDB();
            const user = await User.findById(id);
            if(!user){
                return res.status(404).json({error:"User not found!"});
            }
            return res.status(200).json(user);
        }catch(e){
            return res.status(500).json({error:"Internal server error!",e});
        }
    }
}