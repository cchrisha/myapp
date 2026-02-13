import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDB } from '../db.js';

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') 
    return res.status(405).json({ message: 'Method not allowed' });

  const { name, password } = req.body || {};

  if (!name || !password)
    return res.status(400).json({ message: 'Missing name or password' });

  try {
    const db = await connectToDB();

    const cleanName = name.trim().toLowerCase();

    // 🔥 Case insensitive login
    const user = await db.collection('users').findOne({
      name: cleanName
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id.toString(), name: user.name },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id.toString(),
      name: user.name,
      age: user.age,
      grade_section: user.grade_section,
      points: user.points ?? 0,
      unlocked_level: user.unlocked_level ?? 1
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: 'Server error' });
  }
}
