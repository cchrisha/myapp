import { MongoClient } from 'mongodb';

let client;
let db;

export async function connectToDB() {
  if (db) return db;

  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db(); // Uses the database name in your connection string
  return db;
}
