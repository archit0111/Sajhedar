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

        const trip = new Trip({
          name,
          startDate,
          endDate,
          currency,
          members,
          createdBy: user._id,
        });

        await trip.save();
        res.status(201).json(trip);
      } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ error: 'Failed to create trip' });
      }
    } else if (req.method === 'GET') {
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
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 