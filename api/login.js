import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDB } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  const { name, password } = req.body;
  if (!name || !password)
    return res.status(400).json({ message: 'Kulang ang ibinigay na impormasyon.' });

  try {
    const db = await connectToDB();
    const user = await db.collection('users').findOne({ name });

    if (!user) return res.status(401).json({ message: 'Walang natagpuang account.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mali ang password.' });

    // JWT WITHOUT EXPIRATION
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET);

    res.status(200).json({
      message: 'Matagumpay kang naka-login!',
      token,
      user: {
        userId: user._id,
        name: user.name,
        points: user.points,
        unlockedLevel: user.unlocked_level
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Nagkaroon ng problema sa server.' });
  }
}
