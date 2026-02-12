import { connectToDB } from '../db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  const { userId, amount } = req.body; // amount instead of points

  if (!userId || amount === undefined)
    return res.status(400).json({ message: 'Missing data' });

  try {
    const db = await connectToDB();

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $inc: { points: amount } },
      { returnDocument: 'after' }
    );

    res.json({
      message: 'Points updated successfully',
      points: result.value.points
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating points' });
  }
}
