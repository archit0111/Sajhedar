import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    try{
        const session = await getServerSession(req, res, {});

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Connect to database
    await connectDB();

    //Get request

    if(req.method==='GET'){
        const user = await User.find({email:session.user?.email});
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        return res.status(200).json(user);
    }
    }catch(e){
        return res.status(500).json({error:"Internal server error!",e});
    }
}