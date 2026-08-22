import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import Trip from '@/models/Trip';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer'

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
          // console.log(req.body)
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find the user by email to get their ObjectId
        // console.log(session.user?.email);
        // console.log(session);
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

        const transporter = nodemailer.createTransport({
          service:"gmail",
          auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASS
          }
        });

        
        const allMembers = [creator,...otherMembers.filter((m:(typeof trip.members))=>m.email!==session?.user?.email)]
        
        const trip = new Trip({
          name,
          startDate,
          endDate,
          currency,
          members:allMembers,
          createdBy: user._id,
        });
        
        await trip.save();
        //Sending Invie Email To All Members Of Trip

        const emailsOfMembers:string[] = otherMembers.map((m: (typeof members))=>m.email);
        
        if(emailsOfMembers.length>0){
          const emailPromises = emailsOfMembers.map((email:string)=>transporter.sendMail({
            from:`Sajhedar <${process.env.SMTP_USER}`,
            to:email,
            subject:`You are added in a trip ${name}`,
            html:`
            <div style='font-family: Arial, sans-serif; padding :20px;'>
            <h2>New Trip Invite!✈️</h2>
            <p>Hi there,</p>
            <p><strong>${session.user?.name}</strong> added you to the trip <strong> "${name}" </strong>.</p>
            <p>Now please be ready to enjoy without doing calculations on spends of trip, we are here to handle that.</p>
            <p style="padding:5px"></p>
            <a 
               href="${process.env.NEXT_PUBLIC_APP_URL}/"
               target="_blank"
               style="display: inline-block; padding: 10px 18px; color: #ffffff; background-color: #0d9488; text-decoration: none; border-radius: 6px; font-weight: bold;"
             >
               View Trip Details
             </a>
            <p style="padding:10px"></p>
            <p>Thankyou😊 & Happy journey</p>
            </div>
            `
          }));

          //Execute all mail dispatches concurrently
          await Promise.allSettled(emailPromises);
        }
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

      const requestingUser = trip.members.find((m:(typeof trip.members))=>m.email?.toLowerCase()===session.user?.email?.toLocaleLowerCase());

      if(!requestingUser || requestingUser.role !== 'creator'){
        return res.status(403).json({ error: 'Only the trip creator can assign roles' });
      }

      const targetMember = trip.members.find((m:(typeof trip.members))=>m.email.toLowerCase()===email.toLocaleLowerCase());
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
        const trips = await Trip.find({ 
          $or:[
            {createdBy: user._id},
            {'members.email' : user?.email}
          ]
         })
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