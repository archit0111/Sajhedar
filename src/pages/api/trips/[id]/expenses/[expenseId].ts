import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import Expense from '@/models/Expense';
import { connectDB } from '@/lib/mongodb';
import DeletedExpenses from '@/models/DeletedExpenses';
import Trip from '@/models/Trip';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, {});
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id, expenseId } = req.query;
    if (!id || typeof id !== 'string' || !expenseId || typeof expenseId !== 'string') {
      return res.status(400).json({ error: 'Invalid trip or expense ID' });
    }
    await connectDB();
    if (req.method === 'GET') {
      try {
        const expense = await Expense.findOne({ _id: expenseId, tripId: id }).lean();
        if (!expense) {
          return res.status(404).json({ error: 'Expense not found' });
        }
        console.log(expense)
        res.status(200).json(expense);
      } catch (error) {
        console.error('Error fetching expense:', error);
        res.status(500).json({ error: 'Failed to fetch expense' });
      }
    } else if (req.method === 'PUT') {
      try {
        const { description, amount, payer, date, splitType, splits } = req.body;
        const updateFields: Record<string, unknown> = {};
        if (description !== undefined) updateFields.description = description;
        if (amount !== undefined) updateFields.amount = amount;
        if (payer !== undefined) updateFields.payer = payer;
        if (date !== undefined) updateFields.date = date;
        if (splitType !== undefined) updateFields.splitType = splitType;
        if (splits !== undefined) updateFields.splits = splits;
        const updatedExpense = await Expense.findOneAndUpdate(
          { _id: expenseId, tripId: id },
          { $set: updateFields },
          { new: true }
        );
        if (!updatedExpense) {
          return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json(updatedExpense);
      } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ error: 'Failed to update expense' });
      }
    } else if (req.method === 'DELETE') {
      try {
        const trip = await  Trip.findById(id);
        const userRequesting = trip.members.find((m:any)=>m.email?.toLowerCase()===session?.user?.email?.toLocaleLowerCase());
        if(userRequesting.role ==='creator' || userRequesting.role ==='admin'){
          const deletedExpense = await Expense.findOneAndDelete({
            _id: expenseId,
            tripId: id,
          });
          
          if (!deletedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
          }
          const remover = session.user?.name;
          
          const newDeletedExpense = new DeletedExpenses({
            tripId: deletedExpense.tripId,
            description: deletedExpense.description,
            amount: deletedExpense.amount,
            payer: deletedExpense.payer,
            remover: remover,
            date: deletedExpense.date,
            splitType: deletedExpense.splitType,
            splits: deletedExpense.splits,
          });
          
          await newDeletedExpense.save();
  
          return res.status(200).json({ message: 'Expense deleted successfully', id: expenseId });
        }
        return res.status(403).json({error: 'Only the trip creator and admin can delete expenses.'})
        
      } catch (error) {
        console.error('Error deleting expense:', error);
        return res.status(500).json({ error: 'Failed to delete expense' });
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