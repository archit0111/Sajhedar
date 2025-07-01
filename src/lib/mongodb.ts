import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

//console.log("DEBUG ENV:", process.env);
// Debug: Log environment variables
//console.log('Environment check:');
//console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
//console.log('NODE_ENV:', process.env.NODE_ENV);

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/trips';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

// Mongoose connection for API routes
export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      //console.log('MongoDB already connected');
      return;
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
} 