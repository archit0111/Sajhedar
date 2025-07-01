import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import Expense from '@/models/Expense';
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
        const { description, amount, payer, date, splitType, splits } = req.body;
        if (!description || !amount || !payer || !date) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        // For now, split equally among all trip members
        const splitAmount = amount / (splits?.length || 1);
        const splitArray = (splits && splits.length > 0)
          ? splits.map((s: { memberId: string; amount: number }) => ({ memberId: s.memberId, amount: s.amount }))
          : [{ memberId: payer, amount: splitAmount }];
        const expense = new Expense({
          tripId: id,
          payer,
          amount,
          description,
          date,
          splitType: splitType || 'equal',
          splits: splitArray,
        });
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