import { connectToDB } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ message: 'Method not allowed' });

  const { userId } = req.query;

  try {
    const db = await connectToDB();
    const user = await db.collection('users').findOne({ _id: userId });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ points: user.points || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
