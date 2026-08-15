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

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    // Connect to database
    await connectDB();

    if (req.method === 'GET') {
      try {
        // Find the user by email to get their ObjectId
        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const trip = await Trip.findOne({ 
          _id: id,
          'members.name': user.name
        }).lean();

        if (!trip) {
          return res.status(404).json({ error: 'Trip not found' });
        }

        res.status(200).json(trip);
      } catch (error) {
        console.error('Error fetching trip:', error);
        res.status(500).json({ error: 'Failed to fetch trip' });
      }
    } else if (req.method === 'PUT') {
      try {
        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const { name, startDate, endDate, currency, members } = req.body;
        const updateFields: Record<string, unknown> = {};
        if (name) updateFields.name = name;
        if (startDate) updateFields.startDate = startDate;
        if (endDate) updateFields.endDate = endDate;
        if (currency) updateFields.currency = currency;
        if (members) updateFields.members = members;
        const updatedTrip = await Trip.findOneAndUpdate(
          { _id: id, createdBy: user._id },
          { $set: updateFields },
          { new: true }
        );
        if (!updatedTrip) {
          return res.status(404).json({ error: 'Trip not found or not authorized' });
        }
        res.status(200).json(updatedTrip);
      } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ error: 'Failed to update trip' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 