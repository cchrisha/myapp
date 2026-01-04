import { MongoClient } from 'mongodb';

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to environment variables');
}

if (process.env.NODE_ENV === 'development') {
  // Prevent multiple connections in dev
  if (!global._mongoClientPromise) {
    client = new MongoClient(process.env.MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production
  client = new MongoClient(process.env.MONGODB_URI);
  clientPromise = client.connect();
}

export async function connectToDB() {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME || 'gameDB');
  return db;
}
