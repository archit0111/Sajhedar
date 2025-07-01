import mongoose, { Schema, Document, Types, models } from 'mongoose';

export interface ITrip extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  currency: string;
  members: {
    name: string;
    email?: string;
    userId?: Types.ObjectId;
    _id?: Types.ObjectId;
  }[];
  createdBy: Types.ObjectId;
}

const TripSchema = new Schema<ITrip>({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  currency: { type: String, required: true },
  members: [
    {
      name: { type: String, required: true },
      email: { type: String },
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default models.Trip || mongoose.model<ITrip>('Trip', TripSchema); 