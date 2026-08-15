import mongoose, { Schema, Document, Types, models } from 'mongoose';

export interface IDeletedExpense extends Document {
  tripId: Types.ObjectId;
  payer: string;
  remover:string,
  amount: number;
  description: string;
  date: Date;
  splitType: 'equal' | 'custom' | 'percentage';
  splits: {
    memberId: string;
    amount: number;
  }[];
}

const DeletedExpenseSchema = new Schema<IDeletedExpense>({
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  payer: { type: String, required: true },
  remover: { type: String, required: true },
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

export default models.DeletedExpense || mongoose.model<IDeletedExpense>('DeletedExpense', DeletedExpenseSchema);