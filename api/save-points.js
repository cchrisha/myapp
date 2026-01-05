import { connectToDB } from '../db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  const { userId, points } = req.body;

  if (!userId || points === undefined)
    return res.status(400).json({ message: 'Missing data' });

  try {
    const db = await connectToDB();

    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },    // <<< FIX
      { $set: { points } }
    );

    res.json({ message: 'Points updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating points' });
  }
}
