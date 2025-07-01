import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import Expense from '@/models/Expense';
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
        const expenses = await Expense.find({ tripId: id })
          .sort({ date: -1 })
          .lean();

        res.status(200).json(expenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
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