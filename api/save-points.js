import { connectToDB } from '../db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  const { userId, amount } = req.body;

  if (!userId || amount === undefined)
    return res.status(400).json({ message: 'Missing data' });

  try {
    const db = await connectToDB();

    // 1️⃣ Update
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { points: amount } }
    );

    // 2️⃣ Fetch updated user
    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(userId) }
    );

    if (!updatedUser)
      return res.status(404).json({ message: 'User not found' });

    res.json({
      message: 'Points updated successfully',
      points: updatedUser.points ?? 0
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: 'Server error updating points' });
  }
}
