import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null };

if (!(global as any).mongoose) {
  (global as any).mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    console.log('Already connected to the database');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then(() => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('Database connected successfully');
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Declare global type for TypeScript
declare global {
  var mongoose: MongooseCache;
} 