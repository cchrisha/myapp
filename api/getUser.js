import { connectToDB } from '../db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ message: 'Method not allowed' });

  const { userId } = req.query;

  if (!userId)
    return res.status(200).json({ unlockedLevel: 1 });

  try {
    const db = await connectToDB();
    const user = await db.collection('users')
      .findOne({ _id: new ObjectId(userId) });

    if (!user)
      return res.json({ unlockedLevel: 1 });

    res.json({
      unlockedLevel: user.unlocked_level ?? 1
    });
  } catch {
    res.json({ unlockedLevel: 1 });
  }
}
