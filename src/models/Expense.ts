import mongoose, { Schema, Document, Types, models } from 'mongoose';

export interface IExpense extends Document {
  tripId: Types.ObjectId;
  payer: string;
  amount: number;
  description: string;
  date: Date;
  splitType: 'equal' | 'custom' | 'percentage';
  splits: {
    memberId: string;
    amount: number;
  }[];
}

const ExpenseSchema = new Schema<IExpense>({
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  payer: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  splitType: { type: String, enum: ['equal', 'custom', 'percentage'], required: true },
  splits: [
    {
      memberId: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
});

export default models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema); 