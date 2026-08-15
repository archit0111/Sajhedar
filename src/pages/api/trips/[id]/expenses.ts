import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
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
    } else if (req.method === 'POST') {
      try {
        const { description, amount, payer, date, splitType, splits, tripId } = req.body;
        if (!description || !amount || !payer || !date) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        const expense = new Expense({
          tripId:tripId,
          description,
          amount:Number(amount),
          payer,
          date:new Date(date),
          splitType:splitType,
          splits:splits
        })
        await expense.save();
        res.status(201).json(expense);
      } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ error: 'Failed to create expense' });
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