import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import Trip from '@/models/Trip';
import { connectDB } from '@/lib/mongodb';

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
        const trip = await Trip.findOne({ 
          _id: id,
          createdBy: session.user?.email 
        }).lean();

        if (!trip) {
          return res.status(404).json({ error: 'Trip not found' });
        }

        res.status(200).json(trip);
      } catch (error) {
        console.error('Error fetching trip:', error);
        res.status(500).json({ error: 'Failed to fetch trip' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 