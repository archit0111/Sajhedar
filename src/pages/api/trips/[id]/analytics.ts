import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Expense from '@/models/Expense';


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

        const expenses = await Expense.find({ tripId: id })
            .sort({ date: -1 })
            .lean();

        res.status(200).json(expenses);
    } catch (e) {
        console.error('API Error:', e);
        res.status(500).json({ error: 'Internal server error' })
    }

}