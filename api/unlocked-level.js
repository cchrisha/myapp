import { connectToDB } from '../db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ message: 'Method not allowed' });

  const { userId } = req.query;

  try {
    const db = await connectToDB();
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json({
      unlockedLevel: user.unlocked_level ?? 1,   // ← default level 1
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
