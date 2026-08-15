import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import Trip from '@/models/Trip';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, {});

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Connect to database
    await connectDB();

    if (req.method === 'POST') {
      try {
        const { name, startDate, endDate, currency, members } = req.body;

        if (!name || !startDate || !currency || !members) {
          console.log(req.body)
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find the user by email to get their ObjectId
        console.log(session.user?.email);
        console.log(session);
        const user = await User.findOne({
          email: { $regex: new RegExp(`^${session?.user?.email?.toLowerCase()}$`, 'i') }
        });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const creator = {
          name: session.user?.name,
          email:session.user?.email,
          role:'creator'
        };

        const otherMembers = members.map((m :{name:string; email:string})=>({
          name:m.name,
          email:m.email,
          role:'member'
        }));

        const allMembers = [creator,...otherMembers.filter((m:any)=>m.email!==session?.user?.email)]

        const trip = new Trip({
          name,
          startDate,
          endDate,
          currency,
          members:allMembers,
          createdBy: user._id,
        });

        await trip.save();
        res.status(201).json(trip);
      } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ error: 'Failed to create trip' });
      }
    } else if (req.method === 'PATCH') {
      try {
       const {email,role,tripId}=req.body;
       if (!['admin', 'member'].includes(role)) {
       return res.status(400).json({ error: 'Invalid role specified' });
      }
      const trip =await Trip.findById(tripId);
      if(!trip){
        return res.status(404).json({error:'Trip not found'});
      }

      const requestingUser = trip.members.find((m:any)=>m.email?.toLowerCase()===session.user?.email?.toLocaleLowerCase());

      if(!requestingUser || requestingUser.role !== 'creator'){
        return res.status(403).json({ error: 'Only the trip creator can assign roles' });
      }

      const targetMember = trip.members.find((m:any)=>m.email.toLowerCase()===email.toLocaleLowerCase());
      if(!targetMember){
        return res.status(404).json({error:'Member not found'});
      }
      if(targetMember.role==='creator'){
        return res.status(400).json({error:"cannot change role of creator!"});
      }

      targetMember.role = role;
      await trip.save();

      return res.status(200).json({message:"Role updated successfully!"});
      } catch (error) {
        console.error('Error in updating role:', error);
        res.status(500).json({ error: 'Failed to update role.' });
      }
    }else if (req.method === 'GET') {
      try {
        // Find the user by email to get their ObjectId
        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const trips = await Trip.find({ createdBy: user._id })
          .sort({ createdAt: -1 })
          .lean();

        res.status(200).json(trips);
      } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST','PATCH']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 