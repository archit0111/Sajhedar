import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import DeletedExpenses from "@/models/DeletedExpenses";
import { connectDB } from "@/lib/mongodb";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method!=='GET'){
        res.setHeader('Alow',['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    try{
        const session = await getServerSession(req,res,{});
        if(!session){
            return res.status(401).json({error:"Unauthorized"});
        }
        const {id} = req.query;
        if(!id || typeof id !== 'string'){
            return res.status(400).json({errro:"Invalid trip ID"});
        }
        await connectDB();

        const deletedExpenses = await DeletedExpenses.find({tripId:id})
        .sort({createdAt:-1})
        .lean();

        return res.status(200).json(deletedExpenses);
    }catch(e){
        console.error('Error in fetching deleted expenses',e)
        return res.status(500).json({error:"Failed to fetch deleted expenses"});
    }
}