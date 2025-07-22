import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

async function dbConnect() {
  try {
    const opts = {
      bufferCommands: false,
    };

    const db = await mongoose.connect(MONGODB_URI, opts);
    return db;
  } catch (error) {
    throw error;
  }
}

export default dbConnect; 