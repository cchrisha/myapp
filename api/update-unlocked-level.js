import { connectToDB } from '../../db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { userId, unlockedLevel } = req.body;
  if (!userId || unlockedLevel === undefined) return res.status(400).json({ message: 'Kulang ang datos.' });

  try {
    const db = await connectToDB();
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { unlocked_level: unlockedLevel } }
    );
    res.json({ message: 'Unlocked level updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hindi na-update ang unlocked level.' });
  }
}
